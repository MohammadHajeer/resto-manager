import { z } from "zod";
export declare const createAddressSchema: z.ZodObject<{
    city: z.ZodString;
    street: z.ZodString;
    building: z.ZodString;
    floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    label: z.ZodString;
    phoneNumber: z.ZodString;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateAddressSchema: z.ZodObject<{
    city: z.ZodOptional<z.ZodString>;
    street: z.ZodOptional<z.ZodString>;
    building: z.ZodOptional<z.ZodString>;
    floor: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    label: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const addressParamsSchema: z.ZodObject<{
    addressId: z.ZodString;
}, z.core.$strip>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
