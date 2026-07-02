import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const betterAuthUserIdSchema = z
  .string()
  .trim()
  .min(1, "User ID is required");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name must be less than 80 characters");

export const emailSchema = z.email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long");

export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Phone number is too short")
  .max(20, "Phone number is too long")
  .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number");

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Slug is too short")
  .max(100, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  );

export const descriptionSchema = z
  .string()
  .trim()
  .min(10, "Description must be at least 10 characters")
  .max(1000, "Description is too long");

export const shortDescriptionSchema = z
  .string()
  .trim()
  .min(5, "Description must be at least 5 characters")
  .max(300, "Description is too long");

export const optionalUrlSchema = z
  .union([z.string().trim().url("Invalid URL"), z.literal("")])
  .optional()
  .nullable();

export const priceSchema = z.coerce
  .number()
  .positive("Price must be greater than 0")
  .max(10000, "Price is too high");

export const quantitySchema = z.coerce
  .number()
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(99, "Quantity is too high");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().trim().max(100).optional(),
});

export const addressBaseSchema = z.object({
  city: z.string().trim().min(2, "City is required").max(80),
  street: z.string().trim().min(2, "Street is required").max(120),
  building: z.string().trim().min(1, "Building is required").max(80),
  floor: z.string().trim().max(30).optional().or(z.literal("")),
});
