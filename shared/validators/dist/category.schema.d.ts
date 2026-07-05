import { z } from "zod";
export declare const createCategorySchema: z.ZodObject<{
    restaurantId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const categoryParamsSchema: z.ZodObject<{
    categoryId: z.ZodString;
}, z.core.$strip>;
export declare const categoryListQuerySchema: z.ZodObject<{
    restaurantId: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
