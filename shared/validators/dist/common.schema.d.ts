import { z } from "zod";
export declare const objectIdSchema: z.ZodString;
export declare const betterAuthUserIdSchema: z.ZodString;
export declare const nameSchema: z.ZodString;
export declare const emailSchema: z.ZodEmail;
export declare const passwordSchema: z.ZodString;
export declare const phoneSchema: z.ZodString;
export declare const slugSchema: z.ZodString;
export declare const descriptionSchema: z.ZodString;
export declare const shortDescriptionSchema: z.ZodString;
export declare const optionalUrlSchema: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
export declare const priceSchema: z.ZodCoercedNumber<unknown>;
export declare const quantitySchema: z.ZodCoercedNumber<unknown>;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    q: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const addressBaseSchema: z.ZodObject<{
    city: z.ZodString;
    street: z.ZodString;
    building: z.ZodString;
    floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
