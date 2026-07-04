import { NextFunction, Request, Response } from "express";
import { QueryFilter, Types } from "mongoose";
import {
  restaurantListQuerySchema,
  restaurantReviewSchema,
} from "@restomanager/validators";
import { Restaurant, RestaurantDocument } from "../restaurant.model.js";
import { sendResponse } from "@/utils/sendResponse.js";
import { getPagination } from "@/utils/pagination.js";
import { createPrivateSignedUrl } from "@/utils/storage.js";

type AuthedRequest = Request & {
  auth?: {
    user: {
      id: string;
      role?: string;
    };
  };
};

function isValidObjectId(id: string) {
  return Types.ObjectId.isValid(id);
}

export const getPendingRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page,
      req.query.limit,
      10,
    );

    const [result] = await Restaurant.aggregate([
      {
        $match: {
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "user", // change to "users" if your Better Auth collection is named users
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
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
          name: 1,
          slug: 1,
          status: 1,
          createdAt: 1,

          owner: {
            id: "$owner._id",
            name: "$owner.name",
            email: "$owner.email",
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

    const restaurants = result?.data ?? [];
    const total = result?.pagination?.[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    sendResponse(res, 200, {
      success: true,
      message: "Pending restaurants fetched successfully",
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

export const getAllRestaurantsForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = restaurantListQuerySchema.parse(req.query);

    const filter: QueryFilter<RestaurantDocument> = {};

    if (query.status) {
      filter.status = query.status;
    }

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
        { ownerId: { $regex: query.q, $options: "i" } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean(),

      Restaurant.countDocuments(filter),
    ]);

    sendResponse(res, 200, {
      success: true,
      message: "Restaurants fetched successfully",
      data: {
        restaurants,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { restaurantId } = req.params;

    if (!isValidObjectId(restaurantId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const [restaurant] = await Restaurant.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(restaurantId as string),
        },
      },
      {
        $lookup: {
          from: "user", // change to "users" if your Better Auth collection is named users
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          ownerId: 1,

          name: 1,
          slug: 1,
          description: 1,
          logoUrl: 1,
          bannerUrl: 1,
          contact: 1,
          address: 1,
          cuisineTypes: 1,
          status: 1,
          isOpen: 1,
          openingHours: 1,
          verification: 1,
          createdAt: 1,
          updatedAt: 1,

          owner: {
            id: "$owner._id",
            name: "$owner.name",
            email: "$owner.email",
            phone: "$owner.phone",
            role: "$owner.role",
          },
        },
      },
    ]);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const [businessLicenseSignedUrl, ownerIdDocumentSignedUrl] =
      await Promise.all([
        createPrivateSignedUrl(restaurant.verification?.businessLicensePath),
        createPrivateSignedUrl(restaurant.verification?.ownerIdDocumentPath),
      ]);

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant fetched successfully",
      data: {
        ...restaurant,
        verification: {
          ...restaurant.verification,
          businessLicenseSignedUrl,
          ownerIdDocumentSignedUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reviewRestaurantRegistration = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.auth?.user.id;
    const { restaurantId } = req.params;

    if (!isValidObjectId(restaurantId as string)) {
      return res.status(400).json({
        message: "Invalid restaurant ID",
      });
    }

    const input = restaurantReviewSchema.parse(req.body);

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    restaurant.status = input.status;
    restaurant.verification!.reviewedAt = new Date();
    restaurant.verification!.reviewedBy = adminId;

    if (input.status === "approved") {
      restaurant.verification!.rejectionReason = null;
    }

    if (input.status === "rejected") {
      restaurant.isOpen = false;
      restaurant.verification!.rejectionReason = input.rejectionReason ?? "";
    }

    await restaurant.save();

    sendResponse(res, 200, {
      success: true,
      message:
        input.status === "approved"
          ? "Restaurant approved successfully"
          : "Restaurant rejected successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const suspendRestaurant = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.auth?.user.id;
    const { restaurantId } = req.params;

    if (!isValidObjectId(restaurantId as string)) {
      return res.status(400).json({
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    restaurant.status = "suspended";
    restaurant.isOpen = false;
    restaurant.verification!.reviewedAt = new Date();
    restaurant.verification!.reviewedBy = adminId;

    await restaurant.save();

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant suspended successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};
