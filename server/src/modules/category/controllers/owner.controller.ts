// src/modules/categories/category.controller.ts

import { Request, Response, NextFunction } from "express";
import { isValidObjectId, Types } from "mongoose";

import { Category } from "../category.model.js";
import { sendResponse } from "@/utils/sendResponse.js";
import { Restaurant } from "@/modules/restaurant/restaurant.model.js";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@restomanager/validators";
import { createSlug } from "@/utils/createSlug.js";

const getRestaurantForOwner = async (ownerId: string) => {
  if (!isValidObjectId(ownerId)) return null;

  return Restaurant.findOne({
    ownerId: new Types.ObjectId(ownerId),
  }).lean();
};

export const createCategory = async (
  req: AuthedRequest<{}, {}, CreateCategoryInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you do not have a restaurant",
      });
    }

    const { name, description } = req.body;

    const slug = createSlug(name);

    const category = await Category.create({
      restaurantId: restaurant._id,
      name,
      slug,
      description,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantCategoriesForOwner = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user.id;

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you do not have a restaurant",
      });
    }

    const categories = await Category.find({
      restaurantId: restaurant._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    sendResponse(res, 200, {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthedRequest<{ categoryId: string }, {}, UpdateCategoryInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const ownerId = req.auth!.user.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you do not have a restaurant",
      });
    }

    const { name, description, isActive } = req.body;

    const updateData: {
      name?: string;
      slug?: string;
      description?: string;
      isActive?: boolean;
    } = {};

    if (typeof name === "string") {
      updateData.name = name;
      updateData.slug = createSlug(name);
    }

    if (typeof description === "string") {
      updateData.description = description;
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    const category = await Category.findOneAndUpdate(
      {
        _id: categoryId,
        restaurantId: restaurant._id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const ownerId = req.auth!.user.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you do not have a restaurant",
      });
    }

    // Soft delete for MVP
    const category = await Category.findOneAndUpdate(
      {
        _id: categoryId,
        restaurantId: restaurant._id,
      },
      {
        isActive: false,
      },
      {
        new: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const restoreCategory = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const ownerId = req.auth!.user.id;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const restaurant = await getRestaurantForOwner(ownerId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you do not have a restaurant",
      });
    }

    // Soft delete for MVP
    const category = await Category.findOneAndUpdate(
      {
        _id: categoryId,
        restaurantId: restaurant._id,
      },
      {
        isActive: true,
      },
      {
        new: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Category restored successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
