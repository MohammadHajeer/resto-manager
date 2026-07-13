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
  createMenuItemSchema,
  UpdateMenuItemInput,
  updateMenuItemSchema,
} from "@restomanager/validators";
import { getPublicFileUrl, uploadFileToSupabase } from "@/utils/storage.js";

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
  req: AuthedRequest<{}, {}, { data?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;

    if (!req.body.data) {
      return res.status(400).json({
        success: false,
        message: "Menu item data is required",
      });
    }

    let parsedBody: unknown;

    try {
      parsedBody = JSON.parse(req.body.data);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item data format",
      });
    }

    const validationResult = createMenuItemSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item data",
        errors: validationResult.error.flatten(),
      });
    }

    const input = validationResult.data;

    const imageFile = req.file;

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const {
      categoryId,
      name,
      description,
      price,
      ingredients,
      availableAddons,
      isAvailable,
    } = input;

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
      return sendResponse(res, 404, {
        success: false,
        message: "Category not found for this restaurant",
      });
    }

    const slug = createSlug(name);

    const existingMenuItem = await MenuItem.exists({
      restaurantId: restaurant._id,
      slug,
    });

    if (existingMenuItem) {
      return sendResponse(res, 409, {
        success: false,
        message: "A menu item with this name already exists",
      });
    }

    const publicBucket =
      process.env.SUPABASE_PUBLIC_BUCKET ?? "restaurant-media";

    const folder = `restaurants/${restaurant.slug}/menu-items/${slug}`;

    let imageUrl: string | null = null;

    if (imageFile) {
      const imagePath = await uploadFileToSupabase({
        bucket: publicBucket,
        folder: `${folder}`,
        file: imageFile,
      });

      imageUrl = getPublicFileUrl(publicBucket, imagePath);
    }

    const menuItem = await MenuItem.create({
      restaurantId: restaurant._id,
      categoryId: category._id,
      name,
      slug,
      description,
      price,
      imageUrl,
      ingredients: ingredients ?? [],
      availableAddons: availableAddons ?? [],
      isAvailable: isAvailable ?? true,
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
  req: AuthedRequest<{ menuItemId: string }, {}, { data?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;
    const { menuItemId } = req.params;

    if (!isValidObjectId(menuItemId)) {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid menu item ID",
      });
    }

    if (!req.body.data) {
      return sendResponse(res, 400, {
        success: false,
        message: "Menu item data is required",
      });
    }

    let parsedBody: unknown;

    try {
      parsedBody = JSON.parse(req.body.data);
    } catch {
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid menu item data format",
      });
    }

    const validationResult = updateMenuItemSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item data",
        errors: validationResult.error.flatten(),
      });
    }

    const input = validationResult.data;

    const imageFile = req.file;
    console.log("imageFile", imageFile);

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return sendResponse(res, 404, {
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const existingMenuItem = await MenuItem.findOne({
      _id: new Types.ObjectId(menuItemId),
      restaurantId: restaurant._id,
    });

    if (!existingMenuItem) {
      return sendResponse(res, 404, {
        success: false,
        message: "Menu item not found",
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
    } = input;

    const updateData: Record<string, unknown> = {};

    if (typeof categoryId === "string") {
      if (!isValidObjectId(categoryId)) {
        return sendResponse(res, 400, {
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
        return sendResponse(res, 404, {
          success: false,
          message: "Category not found for this restaurant",
        });
      }

      updateData.categoryId = category._id;
    }

    if (typeof name === "string") {
      const slug = createSlug(name);

      const duplicateMenuItem = await MenuItem.exists({
        _id: { $ne: existingMenuItem._id },
        restaurantId: restaurant._id,
        slug,
      });

      if (duplicateMenuItem) {
        return sendResponse(res, 409, {
          success: false,
          message: "A menu item with this name already exists",
        });
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (typeof description === "string") {
      updateData.description = description;
    }

    if (typeof price === "number") {
      updateData.price = price;
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

    if (typeof imageUrl === "string" || imageUrl === null) {
      updateData.imageUrl = imageUrl;
    }

    if (imageFile) {
      const slugForFolder =
        typeof updateData.slug === "string"
          ? updateData.slug
          : existingMenuItem.slug;

      const folder = `restaurants/${restaurant.slug}/menu-items/${slugForFolder}`;

      const publicBucket =
        process.env.SUPABASE_PUBLIC_BUCKET ?? "restaurant-media";

      const imagePath = await uploadFileToSupabase({
        bucket: publicBucket,
        folder: `${folder}`,
        file: imageFile,
      });

      updateData.imageUrl = getPublicFileUrl(publicBucket, imagePath);
    }

    const updatedMenuItem = await MenuItem.findOneAndUpdate(
      {
        _id: existingMenuItem._id,
        restaurantId: restaurant._id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    sendResponse(res, 200, {
      success: true,
      message: "Menu item updated successfully",
      data: updatedMenuItem,
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
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return sendResponse(res, 404, {
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
      return sendResponse(res, 400, {
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return sendResponse(res, 404, {
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
