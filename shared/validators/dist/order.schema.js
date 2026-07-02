import { z } from "zod";
import { addressBaseSchema, objectIdSchema, phoneSchema, quantitySchema, } from "./common.schema.js";
export const orderStatusSchema = z.enum([
    "pending",
    "accepted",
    "preparing",
    "ready",
    "completed",
    "cancelled",
]);
export const orderAddonSchema = z.object({
    name: z.string().trim().min(2).max(60),
    price: z.coerce.number().min(0).max(1000),
});
export const createOrderItemSchema = z.object({
    menuItemId: objectIdSchema,
    quantity: quantitySchema,
    removedIngredients: z
        .array(z.string().trim().min(2).max(50))
        .max(30)
        .default([]),
    addedIngredients: z.array(orderAddonSchema).max(30).default([]),
});
export const deliveryAddressSnapshotSchema = addressBaseSchema.extend({
    label: z.string().trim().max(40).optional().or(z.literal("")),
    phoneNumber: phoneSchema,
});
export const createOrderSchema = z.object({
    restaurantId: objectIdSchema,
    addressId: objectIdSchema.optional(),
    deliveryAddress: deliveryAddressSnapshotSchema,
    items: z
        .array(createOrderItemSchema)
        .min(1, "Order must contain at least one item")
        .max(50, "Too many items in one order"),
    note: z.string().trim().max(500).optional().or(z.literal("")),
});
export const updateOrderStatusSchema = z
    .object({
    status: orderStatusSchema,
    cancellationReason: z.string().trim().max(500).optional().or(z.literal("")),
})
    .superRefine((data, ctx) => {
    if (data.status === "cancelled" && !data.cancellationReason?.trim()) {
        ctx.addIssue({
            code: "custom",
            message: "Cancellation reason is required",
            path: ["cancellationReason"],
        });
    }
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
