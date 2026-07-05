import { z } from "zod";
import { addressBaseSchema, descriptionSchema, emailSchema, nameSchema, optionalUrlSchema, phoneSchema, slugSchema, } from "./common.schema.js";
export const restaurantStatusSchema = z.enum([
    "pending",
    "approved",
    "rejected",
    "suspended",
]);
export const cuisineTypeSchema = z
    .string()
    .trim()
    .min(2, "Cuisine type is too short")
    .max(40, "Cuisine type is too long");
export const openingHourSchema = z.object({
    day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]),
    openTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid opening time"),
    closeTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid closing time"),
    isClosed: z.boolean().default(false),
});
export const restaurantAddressSchema = addressBaseSchema.extend({
    locationUrl: optionalUrlSchema,
});
export const restaurantRegistrationSchema = z
    .object({
    owner: z.object({
        name: nameSchema,
        email: emailSchema,
        phone: phoneSchema,
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
    }),
    restaurant: z.object({
        name: nameSchema,
        slug: slugSchema.optional(),
        description: descriptionSchema,
        cuisineTypes: z
            .array(cuisineTypeSchema)
            .min(1, "At least one cuisine type is required")
            .max(8, "Too many cuisine types"),
    }),
    contact: z.object({
        phone: phoneSchema,
        email: emailSchema.optional().or(z.literal("")),
    }),
    address: restaurantAddressSchema,
    branding: z.object({
        logo: optionalUrlSchema,
        banner: optionalUrlSchema,
    }),
    verification: z.object({
        businessLicense: optionalUrlSchema,
        ownerIdDocument: optionalUrlSchema,
    }),
})
    .refine((data) => data.owner.password === data.owner.confirmPassword, {
    message: "Passwords do not match",
    path: ["owner", "confirmPassword"],
});
export const restaurantProfileUpdateSchema = z.object({
    name: nameSchema.optional(),
    slug: slugSchema.optional(),
    description: descriptionSchema.optional(),
    logoUrl: optionalUrlSchema,
    bannerUrl: optionalUrlSchema,
    contact: z
        .object({
        phone: phoneSchema.optional(),
        email: emailSchema.optional().or(z.literal("")),
    })
        .optional(),
    address: restaurantAddressSchema.partial().optional(),
    openingHours: z.array(openingHourSchema).max(7).optional(),
    cuisineTypes: z.array(cuisineTypeSchema).min(1).max(8).optional(),
    isOpen: z.boolean().optional(),
});
export const restaurantReviewSchema = z
    .object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().trim().max(500).optional().or(z.literal("")),
})
    .superRefine((data, ctx) => {
    if (data.status === "rejected" && !data.rejectionReason?.trim()) {
        ctx.addIssue({
            code: "custom",
            message: "Rejection reason is required when rejecting a restaurant",
            path: ["rejectionReason"],
        });
    }
});
export const restaurantListQuerySchema = z.object({
    q: z.string().trim().max(100).optional(),
    cuisine: z.string().trim().max(50).optional(),
    status: restaurantStatusSchema.optional(),
    isOpen: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
});
