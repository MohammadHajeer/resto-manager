import type { QueryFilter } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { restaurantListQuerySchema } from "@restomanager/validators";
import { Restaurant, RestaurantDocument } from "../restaurant.model.js";
import { Category } from "@/modules/category/category.model.js";
import { MenuItem } from "@/modules/menuItem/menuItem.model.js";
import { sendResponse } from "@/utils/sendResponse.js";

export const getApprovedRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = restaurantListQuerySchema.parse(req.query);

    const filter: QueryFilter<RestaurantDocument> = {
      status: "approved",
    };

    if (typeof query.isOpen === "boolean") {
      filter.isOpen = query.isOpen;
    }

    if (query.cuisine) {
      filter.cuisineTypes = {
        $regex: query.cuisine,
        $options: "i",
      };
    }

    if (query.q) {
      filter.$or = [
        { name: { $regex: query.q, $options: "i" } },
        { description: { $regex: query.q, $options: "i" } },
        { cuisineTypes: { $regex: query.q, $options: "i" } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter)
        .select("-verification")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),

      Restaurant.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({
      slug,
      status: "approved",
    })
      .select("-verification")
      .lean();

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantMenuBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    const restaurant = await Restaurant.findOne({
      slug,
      status: "approved",
    })
      .select("-verification")
      .lean();

    if (!restaurant) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found",
      });
    }

    const [categories, menuItems] = await Promise.all([
      Category.find({ restaurantId: restaurant._id })
        .sort({ createdAt: 1 })
        .lean(),
      MenuItem.find({ restaurantId: restaurant._id })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const categoriesById = new Map(
      categories.map((category) => [String(category._id), category]),
    );

    const itemsWithCategories = menuItems.map((item) => ({
      ...item,
      category: categoriesById.get(String(item.categoryId)) ?? null,
    }));

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant menu fetched successfully",
      data: {
        restaurant,
        categories,
        menuItems: itemsWithCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};
