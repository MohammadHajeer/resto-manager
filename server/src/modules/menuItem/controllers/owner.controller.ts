import { Restaurant } from "@/modules/restaurant/restaurant.model.js";
import { getPagination } from "@/utils/pagination.js";
import { Response, NextFunction } from "express";
import { isValidObjectId, Types } from "mongoose";
import { MenuItem } from "../menuItem.model.js";
import { sendResponse } from "@/utils/sendResponse.js";
import { Category } from "@/modules/category/category.model.js";
import { createSlug } from "@/utils/createSlug.js";
import {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "@restomanager/validators";

const getRestaurantForOwner = async (ownerId: string) => {
  if (!isValidObjectId(ownerId)) return null;

  return Restaurant.findOne({
    ownerId: new Types.ObjectId(ownerId),
  }).lean();
};

const getOwnerId = (req: AuthedRequest) => {
  return req.auth!.user.id;
};

export const getMyMenuItems = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = getOwnerId(req);

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
      10,
    );

    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId
        : undefined;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const isAvailable =
      req.query.isAvailable === "true"
        ? true
        : req.query.isAvailable === "false"
          ? false
          : undefined;

    const matchStage: Record<string, unknown> = {
      restaurantId: restaurant._id,
    };

    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      matchStage.categoryId = new Types.ObjectId(categoryId);
    }

    if (typeof isAvailable === "boolean") {
      matchStage.isAvailable = isAvailable;
    }

    if (search) {
      matchStage.$text = {
        $search: search,
      };
    }

    const [result] = await MenuItem.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          restaurantId: 1,
          categoryId: 1,
          name: 1,
          slug: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          ingredients: 1,
          availableAddons: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,

          category: {
            id: "$category._id",
            name: "$category.name",
            slug: "$category.slug",
          },
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          pagination: [{ $count: "total" }],
        },
      },
    ]);

    const menuItems = result?.data ?? [];
    const total = result?.pagination?.[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    sendResponse(res, 200, {
      success: true,
      message: "Menu items fetched successfully",
      data: menuItems,
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

export const getMyMenuItemById = async (
  req: AuthedRequest<{ menuItemId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = getOwnerId(req);
    const { menuItemId } = req.params;

    if (!isValidObjectId(menuItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const [menuItem] = await MenuItem.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(menuItemId),
          restaurantId: restaurant._id,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          restaurantId: 1,
          categoryId: 1,
          name: 1,
          slug: 1,
          description: 1,
          price: 1,
          imageUrl: 1,
          ingredients: 1,
          availableAddons: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,

          category: {
            id: "$category._id",
            name: "$category.name",
            slug: "$category.slug",
          },
        },
      },
    ]);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Menu item fetched successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (
  req: AuthedRequest<{}, {}, CreateMenuItemInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const {
      categoryId,
      name,
      description,
      price,
      imageUrl,
      ingredients,
      availableAddons,
      isAvailable,
    } = req.body;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findOne({
      _id: new Types.ObjectId(categoryId),
      restaurantId: restaurant._id,
    }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found for this restaurant",
      });
    }

    const slug = createSlug(name);

    const menuItem = await MenuItem.create({
      restaurantId: restaurant._id,
      categoryId: category._id,
      name,
      slug,
      description,
      price,
      imageUrl: imageUrl ?? null,
      ingredients: ingredients ?? [],
      availableAddons: availableAddons ?? [],
      isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (
  req: AuthedRequest<{ menuItemId: string }, {}, UpdateMenuItemInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;
    const { menuItemId } = req.params;

    if (!isValidObjectId(menuItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const {
      categoryId,
      name,
      description,
      price,
      imageUrl,
      ingredients,
      availableAddons,
      isAvailable,
    } = req.body;

    const updateData: Record<string, unknown> = {};

    if (typeof categoryId === "string") {
      if (!isValidObjectId(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const category = await Category.findOne({
        _id: new Types.ObjectId(categoryId),
        restaurantId: restaurant._id,
        isActive: true,
      }).lean();

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found for this restaurant",
        });
      }

      updateData.categoryId = category._id;
    }

    if (typeof name === "string") {
      updateData.name = name;
      updateData.slug = createSlug(name);
    }

    if (typeof description === "string") {
      updateData.description = description;
    }

    if (typeof price === "number") {
      updateData.price = price;
    }

    if (typeof imageUrl === "string" || imageUrl === null) {
      updateData.imageUrl = imageUrl;
    }

    if (Array.isArray(ingredients)) {
      updateData.ingredients = ingredients;
    }

    if (Array.isArray(availableAddons)) {
      updateData.availableAddons = availableAddons;
    }

    if (typeof isAvailable === "boolean") {
      updateData.isAvailable = isAvailable;
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      {
        _id: new Types.ObjectId(menuItemId),
        restaurantId: restaurant._id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (
  req: AuthedRequest<{ menuItemId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = getOwnerId(req);
    const { menuItemId } = req.params;

    if (!isValidObjectId(menuItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      {
        _id: menuItemId,
        restaurantId: restaurant._id,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
          isAvailable: false,
        },
      },
      {
        new: true,
      },
    );

    sendResponse(res, 200, {
      success: true,
      message: "Menu item deleted successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreMenuItem = async (
  req: AuthedRequest<{ menuItemId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = getOwnerId(req);
    const { menuItemId } = req.params;

    if (!isValidObjectId(menuItemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const menuItem = await MenuItem.findOneAndUpdate(
      {
        _id: menuItemId,
        restaurantId: restaurant._id,
        deletedAt: { $ne: null },
      },
      {
        $set: {
          deletedAt: null,
          isAvailable: true,
        },
      },
      {
        new: true,
      },
    );

    sendResponse(res, 200, {
      success: true,
      message: "Menu item restored successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};
