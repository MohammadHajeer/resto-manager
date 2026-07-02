import { NextFunction, Request, Response } from "express";
import {
  restaurantProfileUpdateSchema,
  restaurantRegistrationSchema,
} from "@restomanager/validators";
import { Restaurant } from "../restaurant.model.js";
import { auth, authDb } from "@/lib/auth.js";

type AuthedRequest = Request & {
  auth?: {
    user: {
      id: string;
      role?: string;
    };
  };
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const registerRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = restaurantRegistrationSchema.parse(req.body);

    const slug = input.restaurant.slug
      ? createSlug(input.restaurant.slug)
      : createSlug(input.restaurant.name);

    const existingRestaurant = await Restaurant.findOne({ slug });

    if (existingRestaurant) {
      return res.status(409).json({
        message: "Restaurant slug already exists",
      });
    }

    const existingUser = await authDb.collection("user").findOne({
      email: input.owner.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

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
      { id: ownerId },
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

      logoUrl: input.branding.logoUrl ?? null,
      bannerUrl: input.branding.bannerUrl ?? null,

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
        businessLicenseUrl: input.verification.businessLicenseUrl ?? null,
        ownerIdDocumentUrl: input.verification.ownerIdDocumentUrl ?? null,
        submittedAt: new Date(),
      },
    });

    res.status(201).json({
      message: "Restaurant registration submitted successfully",
      restaurant,
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

    const input = restaurantProfileUpdateSchema.parse(req.body);

    const restaurant = await Restaurant.findOne({ ownerId });

    if (!restaurant) {
      return res.status(404).json({
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
          message: "Restaurant slug already exists",
        });
      }

      restaurant.slug = nextSlug;
    }

    if (input.name !== undefined) restaurant.name = input.name;
    if (input.description !== undefined)
      restaurant.description = input.description;
    if (input.logoUrl !== undefined) restaurant.logoUrl = input.logoUrl;
    if (input.bannerUrl !== undefined) restaurant.bannerUrl = input.bannerUrl;
    if (input.contact !== undefined) {
      restaurant.contact = input.contact;
    }
    if (input.address !== undefined) restaurant.address = input.address;
    if (input.openingHours !== undefined)
      restaurant.openingHours = input.openingHours;
    if (input.cuisineTypes !== undefined)
      restaurant.cuisineTypes = input.cuisineTypes;

    await restaurant.save();

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant,
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
