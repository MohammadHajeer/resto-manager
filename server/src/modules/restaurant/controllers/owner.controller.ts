import { NextFunction, Request, Response } from "express";
import {
  RestaurantProfileUpdateInput,
  restaurantRegistrationSchema,
} from "@restomanager/validators";
import { Restaurant } from "../restaurant.model.js";
import { auth, authDb } from "@/lib/auth.js";
import { getPublicFileUrl, uploadFileToSupabase } from "@/utils/storage.js";
import { sendResponse } from "@/utils/sendResponse.js";
import { ObjectId } from "mongodb";
import { createSlug } from "@/utils/createSlug.js";

type RestaurantRegisterFiles = {
  logo?: Express.Multer.File[];
  banner?: Express.Multer.File[];
  businessLicense?: Express.Multer.File[];
  ownerIdDocument?: Express.Multer.File[];
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
      process.env.SUPABASE_PUBLIC_BUCKET ?? "restaurant-images";

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

    if (!ownerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const restaurant = await Restaurant.findOne({ ownerId });

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

export const updateMyRestaurant = async (
  req: AuthedRequest<{}, {}, RestaurantProfileUpdateInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ownerId = req.auth?.user.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const input = req.body;

    const restaurant = await Restaurant.findOne({ ownerId });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (input.slug) {
      const nextSlug = createSlug(input.slug);

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

    if (input.name !== undefined) {
      restaurant.name = input.name;
    }

    if (input.description !== undefined) {
      restaurant.description = input.description;
    }

    if (input.logoUrl !== undefined) {
      restaurant.logoUrl = input.logoUrl;
    }

    if (input.bannerUrl !== undefined) {
      restaurant.bannerUrl = input.bannerUrl;
    }

    // Update contact fields partially
    if (input.contact?.phone !== undefined) {
      restaurant.set("contact.phone", input.contact.phone);
    }

    if (input.contact?.email !== undefined) {
      restaurant.set("contact.email", input.contact.email);
    }

    // Update address fields partially
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

    // These are full replacements, and that is okay
    if (input.openingHours !== undefined) {
      restaurant.openingHours =
        input.openingHours as typeof restaurant.openingHours;
    }

    if (input.cuisineTypes !== undefined) {
      restaurant.cuisineTypes = input.cuisineTypes;
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
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

    if (!ownerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

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

    res.status(200).json({
      message: isOpen ? "Restaurant is now open" : "Restaurant is now closed",
      restaurant,
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

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const restaurant = await Restaurant.findOne({ ownerId }).select(
      "name slug status verification createdAt updatedAt",
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant registration was not found.",
      });
    }

    return res.status(200).json({
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
