import { z } from "zod";
import { betterAuthUserIdSchema, objectIdSchema } from "./common.schema.js";
import { userRoleSchema } from "./auth.schema.js";
export const updateUserRoleSchema = z.object({
    userId: betterAuthUserIdSchema,
    role: userRoleSchema,
});
export const banUserSchema = z.object({
    userId: betterAuthUserIdSchema,
    reason: z.string().trim().min(5, "Ban reason is required").max(500),
    banExpires: z.coerce.date().optional().nullable(),
});
export const unbanUserSchema = z.object({
    userId: betterAuthUserIdSchema,
});
export const adminRestaurantParamsSchema = z.object({
    restaurantId: objectIdSchema,
});
