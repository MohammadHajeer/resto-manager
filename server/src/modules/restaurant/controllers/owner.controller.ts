import { NextFunction, Request, Response } from "express";
import {
  restaurantProfileUpdateSchema,
  restaurantRegistrationSchema,
} from "@restomanager/validators";
import { Restaurant } from "../restaurant.model.js";
import { auth, authDb } from "@/lib/auth.js";
import {
  deleteFilesFromSupabase,
  getFilePathFromPublicUrl,
  getPublicFileUrl,
  uploadFileToSupabase,
} from "@/utils/storage.js";
import { sendResponse } from "@/utils/sendResponse.js";
import { ObjectId } from "mongodb";
import { createSlug } from "@/utils/createSlug.js";
import { QueryFilter } from "mongoose";
import {
  MenuItem,
  MenuItemDocument,
} from "@/modules/menuItem/menuItem.model.js";
import { Category } from "@/modules/category/category.model.js";

type RestaurantRegisterFiles = {
  logo?: Express.Multer.File[];
  banner?: Express.Multer.File[];
  businessLicense?: Express.Multer.File[];
  ownerIdDocument?: Express.Multer.File[];
};

type RestaurantProfileUpdateFiles = {
  logoFile?: Express.Multer.File[];
  bannerFile?: Express.Multer.File[];
};

export const registerRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedBody = JSON.parse(req.body.data);
    const input = restaurantRegistrationSchema.parse(parsedBody);

    const files = req.files as RestaurantRegisterFiles | undefined;

    const logoFile = files?.logo?.[0];
    const bannerFile = files?.banner?.[0];
    const businessLicenseFile = files?.businessLicense?.[0];
    const ownerIdDocumentFile = files?.ownerIdDocument?.[0];

    if (!businessLicenseFile || !ownerIdDocumentFile) {
      return sendResponse(res, 400, {
        success: false,
        message: "Business license and owner ID document are required",
      });
    }

    const slug = input.restaurant.slug
      ? createSlug(input.restaurant.slug)
      : createSlug(input.restaurant.name);

    const existingRestaurant = await Restaurant.findOne({ slug });

    if (existingRestaurant) {
      return sendResponse(res, 409, {
        success: false,
        message: "Restaurant slug already exists",
      });
    }

    const existingUser = await authDb.collection("user").findOne({
      email: input.owner.email,
    });

    if (existingUser) {
      return sendResponse(res, 409, {
        success: false,
        message: "A user with this email already exists",
      });
    }

    const publicBucket =
      process.env.SUPABASE_PUBLIC_BUCKET ?? "restaurant-media";

    const privateBucket =
      process.env.SUPABASE_PRIVATE_BUCKET ?? "restaurant-documents";

    const folder = `restaurants/${slug}`;

    let logoUrl: string | null = null;
    let bannerUrl: string | null = null;

    if (logoFile) {
      const logoPath = await uploadFileToSupabase({
        bucket: publicBucket,
        folder: `${folder}/branding`,
        file: logoFile,
      });

      logoUrl = getPublicFileUrl(publicBucket, logoPath);
    }

    if (bannerFile) {
      const bannerPath = await uploadFileToSupabase({
        bucket: publicBucket,
        folder: `${folder}/branding`,
        file: bannerFile,
      });

      bannerUrl = getPublicFileUrl(publicBucket, bannerPath);
    }

    const businessLicensePath = await uploadFileToSupabase({
      bucket: privateBucket,
      folder: `${folder}/documents`,
      file: businessLicenseFile,
    });

    const ownerIdDocumentPath = await uploadFileToSupabase({
      bucket: privateBucket,
      folder: `${folder}/documents`,
      file: ownerIdDocumentFile,
    });

    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: input.owner.name,
        email: input.owner.email,
        password: input.owner.password,
        phone: input.owner.phone,
      },
    });

    const ownerId = signUpResult.user.id;

    await authDb.collection("user").updateOne(
      { _id: new ObjectId(ownerId) },
      {
        $set: {
          role: "restaurant_owner",
          phone: input.owner.phone,
        },
      },
    );

    const restaurant = await Restaurant.create({
      ownerId,

      name: input.restaurant.name,
      slug,
      description: input.restaurant.description,
      cuisineTypes: input.restaurant.cuisineTypes,

      logoUrl,
      bannerUrl,

      contact: {
        phone: input.contact.phone,
        email: input.contact.email || null,
      },

      address: {
        city: input.address.city,
        street: input.address.street,
        building: input.address.building,
        floor: input.address.floor ?? "",
        locationUrl: input.address.locationUrl ?? null,
      },

      status: "pending",
      isOpen: false,

      verification: {
        businessLicensePath,
        ownerIdDocumentPath,
        submittedAt: new Date(),
      },
    });

    sendResponse(res, 201, {
      success: true,
      message: "Restaurant registration submitted successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRestaurant = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth?.user.id;

    const restaurant = await Restaurant.findOne({ ownerId });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant fetched successfully",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyRestaurant = async (
  req: AuthedRequest<{}, {}, any>,
  res: Response,
  next: NextFunction,
) => {
  const publicBucket = process.env.SUPABASE_PUBLIC_BUCKET ?? "restaurant-media";

  const newlyUploadedPaths: string[] = [];
  let shouldCleanupNewUploads = true;

  try {
    const ownerId = req.auth?.user.id;

    const restaurant = await Restaurant.findOne({ ownerId });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const parsedBody =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    const input = restaurantProfileUpdateSchema.parse(parsedBody);

    const files = req.files as RestaurantProfileUpdateFiles | undefined;

    const logoFile = files?.logoFile?.[0];
    const bannerFile = files?.bannerFile?.[0];

    const oldLogoUrl = restaurant.logoUrl ?? null;
    const oldBannerUrl = restaurant.bannerUrl ?? null;

    let nextLogoUrl: string | undefined;
    let nextBannerUrl: string | undefined;

    let nextSlug = restaurant.slug;

    if (input.slug) {
      nextSlug = createSlug(input.slug);

      const slugExists = await Restaurant.findOne({
        slug: nextSlug,
        _id: { $ne: restaurant._id },
      });

      if (slugExists) {
        return res.status(409).json({
          success: false,
          message: "Restaurant slug already exists",
        });
      }

      restaurant.slug = nextSlug;
    }

    const folder = `restaurants/${nextSlug}`;

    if (logoFile) {
      const logoPath = await uploadFileToSupabase({
        bucket: publicBucket,
        folder: `${folder}/branding`,
        file: logoFile,
      });

      newlyUploadedPaths.push(logoPath);
      nextLogoUrl = getPublicFileUrl(publicBucket, logoPath);
    }

    if (bannerFile) {
      const bannerPath = await uploadFileToSupabase({
        bucket: publicBucket,
        folder: `${folder}/branding`,
        file: bannerFile,
      });

      newlyUploadedPaths.push(bannerPath);
      nextBannerUrl = getPublicFileUrl(publicBucket, bannerPath);
    }

    if (input.name !== undefined) {
      restaurant.name = input.name;
    }

    if (input.description !== undefined) {
      restaurant.description = input.description;
    }

    if (nextLogoUrl !== undefined) {
      restaurant.logoUrl = nextLogoUrl;
    }

    if (nextBannerUrl !== undefined) {
      restaurant.bannerUrl = nextBannerUrl;
    }

    if (input.contact?.phone !== undefined) {
      restaurant.set("contact.phone", input.contact.phone);
    }

    if (input.contact?.email !== undefined) {
      restaurant.set("contact.email", input.contact.email);
    }

    if (input.address?.city !== undefined) {
      restaurant.set("address.city", input.address.city);
    }

    if (input.address?.street !== undefined) {
      restaurant.set("address.street", input.address.street);
    }

    if (input.address?.building !== undefined) {
      restaurant.set("address.building", input.address.building);
    }

    if (input.address?.floor !== undefined) {
      restaurant.set("address.floor", input.address.floor);
    }

    if (input.address?.locationUrl !== undefined) {
      restaurant.set("address.locationUrl", input.address.locationUrl);
    }

    if (input.openingHours !== undefined) {
      restaurant.openingHours =
        input.openingHours as typeof restaurant.openingHours;
    }

    if (input.cuisineTypes !== undefined) {
      restaurant.cuisineTypes = input.cuisineTypes;
    }

    await restaurant.save();

    shouldCleanupNewUploads = false;

    const oldLogoPath =
      nextLogoUrl !== undefined
        ? getFilePathFromPublicUrl(publicBucket, oldLogoUrl)
        : null;

    const oldBannerPath =
      nextBannerUrl !== undefined
        ? getFilePathFromPublicUrl(publicBucket, oldBannerUrl)
        : null;

    try {
      await deleteFilesFromSupabase({
        bucket: publicBucket,
        filePaths: [oldLogoPath, oldBannerPath],
      });
    } catch (deleteError) {
      console.warn("Failed to delete old restaurant images:", deleteError);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
    if (shouldCleanupNewUploads && newlyUploadedPaths.length > 0) {
      try {
        await deleteFilesFromSupabase({
          bucket: publicBucket,
          filePaths: newlyUploadedPaths,
        });
      } catch (cleanupError) {
        console.warn(
          "Failed to cleanup uploaded restaurant images:",
          cleanupError,
        );
      }
    }

    next(error);
  }
};

export const toggleMyRestaurantOpenStatus = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth?.user.id;

    const { isOpen } = req.body as { isOpen?: boolean };

    if (typeof isOpen !== "boolean") {
      return res.status(400).json({
        message: "isOpen must be a boolean",
      });
    }

    const restaurant = await Restaurant.findOne({ ownerId });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (isOpen && restaurant.status !== "approved") {
      return res.status(400).json({
        message: "Restaurant must be approved before it can be opened",
      });
    }

    restaurant.isOpen = isOpen;
    await restaurant.save();

    sendResponse(res, 200, {
      success: true,
      message: `Restaurant is now ${isOpen ? "open" : "closed"}`,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerRestaurantStatus = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth?.user?.id;

    const restaurant = await Restaurant.findOne({ ownerId }).select(
      "name slug status verification createdAt updatedAt",
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant registration was not found.",
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: "Restaurant status fetched successfully.",
      data: {
        restaurantId: restaurant._id,
        name: restaurant.name,
        slug: restaurant.slug,
        status: restaurant.status,
        rejectionReason: restaurant.verification?.rejectionReason ?? null,
        createdAt: restaurant.createdAt,
        updatedAt: restaurant.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const escapeRegex = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

type MenuStatusFilter = "all" | "available" | "out-of-stock";

export const getOwnerRestaurantMenu = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth!.user!.id;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const status =
      typeof req.query.status === "string"
        ? (req.query.status as MenuStatusFilter)
        : "all";

    const restaurant = await Restaurant.findOne({ ownerId })
      .select("_id")
      .lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    const menuItemFilter: QueryFilter<MenuItemDocument> = {
      restaurantId: restaurant._id,
      deletedAt: null,
    };

    if (status === "available") {
      menuItemFilter.isAvailable = true;
    }

    if (status === "out-of-stock") {
      menuItemFilter.isAvailable = false;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      menuItemFilter.$or = [
        { name: regex },
        { description: regex },
        { ingredients: regex },
      ];
    }

    const [categories, menuItems, statsResult] = await Promise.all([
      Category.find({
        restaurantId: restaurant._id,
        isActive: true,
      })
        .select("_id name slug description isActive createdAt updatedAt")
        .sort({ createdAt: 1 })
        .lean(),

      MenuItem.find(menuItemFilter)
        .select(
          "_id restaurantId categoryId name slug description price imageUrl ingredients availableAddons isAvailable deletedAt createdAt updatedAt",
        )
        .sort({ createdAt: 1 })
        .lean(),

      MenuItem.aggregate([
        {
          $match: {
            restaurantId: restaurant._id,
            deletedAt: null,
          },
        },
        {
          $group: {
            _id: null,
            totalItems: { $sum: 1 },
            activeItems: {
              $sum: {
                $cond: [{ $eq: ["$isAvailable", true] }, 1, 0],
              },
            },
            outOfStockItems: {
              $sum: {
                $cond: [{ $eq: ["$isAvailable", false] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalItems: 1,
            activeItems: 1,
            outOfStockItems: 1,
          },
        },
      ]),
    ]);

    const itemsByCategoryId = new Map<string, typeof menuItems>();

    for (const item of menuItems) {
      const categoryId = String(item.categoryId);

      const currentItems = itemsByCategoryId.get(categoryId) ?? [];

      currentItems.push(item);
      itemsByCategoryId.set(categoryId, currentItems);
    }

    let sections = categories.map((category) => {
      const items = itemsByCategoryId.get(String(category._id)) ?? [];

      return {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
        itemCount: items.length,
        items,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    });

    if (search || status !== "all") {
      sections = sections.filter((section) => section.items.length > 0);
    }

    const stats = statsResult[0] ?? {
      totalItems: 0,
      activeItems: 0,
      outOfStockItems: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Owner restaurant menu fetched successfully",
      data: {
        stats,
        sections,
      },
    });
  } catch (error) {
    next(error);
  }
};
