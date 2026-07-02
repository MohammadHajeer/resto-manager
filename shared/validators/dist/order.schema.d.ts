import { z } from "zod";
export declare const orderStatusSchema: z.ZodEnum<{
    pending: "pending";
    accepted: "accepted";
    preparing: "preparing";
    ready: "ready";
    completed: "completed";
    cancelled: "cancelled";
}>;
export declare const orderAddonSchema: z.ZodObject<{
    name: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const createOrderItemSchema: z.ZodObject<{
    menuItemId: z.ZodString;
    quantity: z.ZodCoercedNumber<unknown>;
    removedIngredients: z.ZodDefault<z.ZodArray<z.ZodString>>;
    addedIngredients: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        price: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const deliveryAddressSnapshotSchema: z.ZodObject<{
    city: z.ZodString;
    street: z.ZodString;
    building: z.ZodString;
    floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    label: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phoneNumber: z.ZodString;
}, z.core.$strip>;
export declare const createOrderSchema: z.ZodObject<{
    restaurantId: z.ZodString;
    addressId: z.ZodOptional<z.ZodString>;
    deliveryAddress: z.ZodObject<{
        city: z.ZodString;
        street: z.ZodString;
        building: z.ZodString;
        floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        label: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        phoneNumber: z.ZodString;
    }, z.core.$strip>;
    items: z.ZodArray<z.ZodObject<{
        menuItemId: z.ZodString;
        quantity: z.ZodCoercedNumber<unknown>;
        removedIngredients: z.ZodDefault<z.ZodArray<z.ZodString>>;
        addedIngredients: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            price: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    note: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        pending: "pending";
        accepted: "accepted";
        preparing: "preparing";
        ready: "ready";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    cancellationReason: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const orderParamsSchema: z.ZodObject<{
    orderId: z.ZodString;
}, z.core.$strip>;
export declare const orderListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        accepted: "accepted";
        preparing: "preparing";
        ready: "ready";
        completed: "completed";
        cancelled: "cancelled";
    }>>;
    restaurantId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
