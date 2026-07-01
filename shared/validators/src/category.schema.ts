import { z } from "zod";
import {
  objectIdSchema,
  shortDescriptionSchema,
  slugSchema,
} from "./common.schema.js";

export const createCategorySchema = z.object({
  restaurantId: objectIdSchema.optional(),
  name: z.string().trim().min(2, "Category name is required").max(60),
  slug: slugSchema.optional(),
  description: shortDescriptionSchema.optional().or(z.literal("")),
});

export const updateCategorySchema = createCategorySchema
  .omit({ restaurantId: true })
  .partial();

export const categoryParamsSchema = z.object({
  categoryId: objectIdSchema,
});

export const categoryListQuerySchema = z.object({
  restaurantId: objectIdSchema.optional(),
  q: z.string().trim().max(100).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
