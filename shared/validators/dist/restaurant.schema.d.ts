import { z } from "zod";
export declare const restaurantStatusSchema: z.ZodEnum<{
    pending: "pending";
    approved: "approved";
    rejected: "rejected";
    suspended: "suspended";
}>;
export declare const cuisineTypeSchema: z.ZodString;
export declare const openingHourSchema: z.ZodObject<{
    day: z.ZodEnum<{
        Monday: "Monday";
        Tuesday: "Tuesday";
        Wednesday: "Wednesday";
        Thursday: "Thursday";
        Friday: "Friday";
        Saturday: "Saturday";
        Sunday: "Sunday";
    }>;
    openTime: z.ZodString;
    closeTime: z.ZodString;
    isClosed: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const restaurantAddressSchema: z.ZodObject<{
    city: z.ZodString;
    street: z.ZodString;
    building: z.ZodString;
    floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    locationUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
}, z.core.$strip>;
export declare const restaurantRegistrationSchema: z.ZodObject<{
    owner: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodEmail;
        phone: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strip>;
    restaurant: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodOptional<z.ZodString>;
        description: z.ZodString;
        cuisineTypes: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    contact: z.ZodObject<{
        phone: z.ZodString;
        email: z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>;
    }, z.core.$strip>;
    address: z.ZodObject<{
        city: z.ZodString;
        street: z.ZodString;
        building: z.ZodString;
        floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        locationUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    }, z.core.$strip>;
    branding: z.ZodObject<{
        logoUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
        bannerUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    }, z.core.$strip>;
    verification: z.ZodObject<{
        businessLicenseUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
        ownerIdDocumentUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const restaurantProfileUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    logoUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    bannerUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    contact: z.ZodOptional<z.ZodObject<{
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodEmail>, z.ZodLiteral<"">]>;
    }, z.core.$strip>>;
    address: z.ZodOptional<z.ZodObject<{
        city: z.ZodString;
        street: z.ZodString;
        building: z.ZodString;
        floor: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        locationUrl: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<"">]>>>;
    }, z.core.$strip>>;
    openingHours: z.ZodOptional<z.ZodArray<z.ZodObject<{
        day: z.ZodEnum<{
            Monday: "Monday";
            Tuesday: "Tuesday";
            Wednesday: "Wednesday";
            Thursday: "Thursday";
            Friday: "Friday";
            Saturday: "Saturday";
            Sunday: "Sunday";
        }>;
        openTime: z.ZodString;
        closeTime: z.ZodString;
        isClosed: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    cuisineTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isOpen: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const restaurantReviewSchema: z.ZodObject<{
    status: z.ZodEnum<{
        approved: "approved";
        rejected: "rejected";
    }>;
    rejectionReason: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const restaurantListQuerySchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    cuisine: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
        suspended: "suspended";
    }>>;
    isOpen: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type RestaurantRegistrationInput = z.infer<typeof restaurantRegistrationSchema>;
export type RestaurantProfileUpdateInput = z.infer<typeof restaurantProfileUpdateSchema>;
export type RestaurantReviewInput = z.infer<typeof restaurantReviewSchema>;
