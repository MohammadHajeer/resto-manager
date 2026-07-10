import { z } from "zod";
import { addressBaseSchema, objectIdSchema, phoneSchema, quantitySchema, } from "./common.schema.js";
import { ingredientSchema } from "./menu-item.schema.js";
export const orderStatusSchema = z.enum([
    "pending",
    "accepted",
    "preparing",
    "ready",
    "completed",
    "cancelled",
]);
export const selectedAddonNameSchema = z.string().trim().min(2).max(60);
export const createOrderItemSchema = z.object({
    menuItemId: objectIdSchema,
    quantity: quantitySchema,
    selectedAddonNames: z.array(selectedAddonNameSchema).max(30).default([]),
    // RES-82: ingredients the customer asked to remove from this line item.
    // Validated against the menu item's own `ingredients` list on creation
    // (see orders customer controller) so only real ingredients can be removed.
    removedIngredientNames: z.array(ingredientSchema).max(30).default([]),
});
export const deliveryAddressSnapshotSchema = addressBaseSchema.extend({
    label: z.string().trim().max(40).optional().default(""),
    phoneNumber: phoneSchema,
});
export const createOrderSchema = z.object({
    restaurantId: objectIdSchema,
    deliveryAddress: deliveryAddressSnapshotSchema,
    items: z
        .array(createOrderItemSchema)
        .min(1, "Order must contain at least one item")
        .max(50, "Too many items in one order"),
    customerNote: z.string().trim().max(500).optional().default(""),
});
export const updateOrderStatusSchema = z.object({
    status: orderStatusSchema,
});
export const orderParamsSchema = z.object({
    orderId: objectIdSchema,
});
export const orderListQuerySchema = z.object({
    status: orderStatusSchema.optional(),
    restaurantId: objectIdSchema.optional(),
    customerId: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});
