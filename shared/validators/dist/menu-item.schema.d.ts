import { z } from "zod";
export declare const ingredientSchema: z.ZodString;
export declare const addonSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const createMenuItemSchema: z.ZodObject<{
    restaurantId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    ingredients: z.ZodDefault<z.ZodArray<z.ZodString>>;
    availableAddons: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        price: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>>;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateMenuItemSchema: z.ZodObject<{
    restaurantId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>>;
    ingredients: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    availableAddons: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        price: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>>>;
    isAvailable: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const menuItemParamsSchema: z.ZodObject<{
    menuItemId: z.ZodString;
}, z.core.$strip>;
export declare const menuItemListQuerySchema: z.ZodObject<{
    restaurantId: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    isAvailable: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type AddonInput = z.infer<typeof addonSchema>;
