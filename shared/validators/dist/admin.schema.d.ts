import { z } from "zod";
export declare const updateUserRoleSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        restaurant_owner: "restaurant_owner";
        customer: "customer";
    }>;
}, z.core.$strip>;
export declare const banUserSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodString;
    banExpires: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
}, z.core.$strip>;
export declare const unbanUserSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export declare const adminRestaurantParamsSchema: z.ZodObject<{
    restaurantId: z.ZodString;
}, z.core.$strip>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;
