import { z } from "zod";
import { addressBaseSchema, objectIdSchema, phoneSchema, } from "./common.schema.js";
export const createAddressSchema = addressBaseSchema.extend({
    label: z.string().trim().min(2, "Label is required").max(40),
    phoneNumber: phoneSchema,
    isDefault: z.boolean().default(false),
});
export const updateAddressSchema = createAddressSchema.partial();
export const addressParamsSchema = z.object({
    addressId: objectIdSchema,
});
