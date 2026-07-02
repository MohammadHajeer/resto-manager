import { z } from "zod";
import { objectIdSchema, optionalUrlSchema, priceSchema, shortDescriptionSchema, slugSchema, } from "./common.schema.js";
export const ingredientSchema = z
    .string()
    .trim()
    .min(2, "Ingredient name is too short")
    .max(50, "Ingredient name is too long");
export const addonSchema = z.object({
    name: z.string().trim().min(2, "Add-on name is required").max(60),
    price: z.coerce.number().min(0, "Add-on price cannot be negative").max(1000),
});
export const createMenuItemSchema = z.object({
    restaurantId: objectIdSchema.optional(),
    categoryId: objectIdSchema,
    name: z.string().trim().min(2, "Item name is required").max(100),
    slug: slugSchema.optional(),
    description: shortDescriptionSchema,
    price: priceSchema,
    imageUrl: optionalUrlSchema,
    ingredients: z.array(ingredientSchema).max(30).default([]),
    availableAddons: z.array(addonSchema).max(30).default([]),
    isAvailable: z.boolean().default(true),
});
export const updateMenuItemSchema = createMenuItemSchema.partial();
export const menuItemParamsSchema = z.object({
    menuItemId: objectIdSchema,
});
export const menuItemListQuerySchema = z.object({
    restaurantId: objectIdSchema.optional(),
    categoryId: objectIdSchema.optional(),
    q: z.string().trim().max(100).optional(),
    isAvailable: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
});
