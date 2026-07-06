import { getPagination } from "@/utils/pagination.js";
import type { NextFunction, Request, Response } from "express";
import { Restaurant } from "../restaurant.model.js";
import { MenuItem } from "@/modules/menuItem/menuItem.model.js";
import { Category } from "@/modules/category/category.model.js";
import { sendResponse } from "@/utils/sendResponse.js";
import { getQueryArray } from "@/utils/getQueryArray.js";

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getPublicRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
      12,
    );

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const isOpen =
      req.query.isOpen === "true"
        ? true
        : req.query.isOpen === "false"
          ? false
          : undefined;

    const cities = getQueryArray(req.query.city);
    const cuisines = getQueryArray(req.query.cuisine);

    const matchStage: Record<string, unknown> = {
      status: "approved",
    };

    if (isOpen !== undefined) {
      matchStage.isOpen = isOpen;
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      matchStage.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { "address.city": searchRegex },
        { cuisineTypes: searchRegex },
      ];
    }

    if (cities.length > 0) {
      matchStage["address.city"] = {
        $in: cities,
      };
    }

    if (cuisines.length > 0) {
      matchStage.cuisineTypes = {
        $in: cuisines,
      };
    }

    const [result] = await Restaurant.aggregate([
      {
        $match: matchStage,
      },
      {
        $sort: {
          isOpen: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          ownerId: 0,
          verification: 0,
          __v: 0,
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          pagination: [{ $count: "total" }],
        },
      },
    ]);

    const restaurants = result?.data ?? [];
    const total = result?.pagination?.[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    sendResponse(res, 200, {
      success: true,
      message: "Restaurants fetched successfully",
      data: restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicRestaurantBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({
      slug,
      status: "approved",
    })
      .select("-ownerId -verification -__v")
      .lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const categories = await Category.find({
      restaurantId: restaurant._id,
      isActive: true,
    })
      .select("_id name slug description")
      .sort({ createdAt: 1 })
      .lean();

    const categoryIds = categories.map((category) => category._id);

    const menuItems = await MenuItem.find({
      restaurantId: restaurant._id,
      categoryId: { $in: categoryIds },
      isAvailable: true,
      deletedAt: null,
    })
      .select(
        "_id categoryId name slug description price imageUrl ingredients availableAddons isAvailable",
      )
      .sort({ createdAt: -1 })
      .lean();

    const menuItemsByCategoryId = new Map<string, typeof menuItems>();

    for (const menuItem of menuItems) {
      const categoryId = menuItem.categoryId.toString();

      const existingItems = menuItemsByCategoryId.get(categoryId) ?? [];
      existingItems.push(menuItem);

      menuItemsByCategoryId.set(categoryId, existingItems);
    }

    const categoriesWithMenuItems = categories.map((category) => ({
      ...category,
      menuItems: menuItemsByCategoryId.get(category._id.toString()) ?? [],
    }));

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant fetched successfully",
      data: {
        restaurant,
        categories: categoriesWithMenuItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicRestaurantFilterOptions = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [result] = await Restaurant.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $facet: {
          cities: [
            {
              $group: {
                _id: "$address.city",
                count: { $sum: 1 },
              },
            },
            {
              $match: {
                _id: { $ne: null },
              },
            },
            {
              $sort: {
                count: -1,
                _id: 1,
              },
            },
            {
              $limit: 8,
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                count: 1,
              },
            },
          ],

          cuisines: [
            {
              $unwind: "$cuisineTypes",
            },
            {
              $group: {
                _id: "$cuisineTypes",
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                count: -1,
                _id: 1,
              },
            },
            {
              $limit: 8,
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant filter options fetched successfully",
      data: {
        cities: result?.cities ?? [],
        cuisines: result?.cuisines ?? [],
      },
    });
  } catch (error) {
    next(error);
  }
};
