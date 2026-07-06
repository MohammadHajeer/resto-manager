import { z } from "zod";

export const openingHourDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const optionalEmailSchema = z
  .union([z.string().email("Invalid email"), z.literal("")])
  .optional();

const optionalUrlSchema = z
  .union([z.string().url("Invalid URL"), z.literal("")])
  .optional();

const optionalTextSchema = z.string().optional();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const isFile = (value: unknown): value is File => {
  return typeof File !== "undefined" && value instanceof File;
};

const imageFileSchema = z
  .custom<File | null | undefined>(
    (file) => file == null || isFile(file),
    "Invalid image file",
  )
  .refine(
    (file) => !file || file.size <= MAX_IMAGE_SIZE,
    "Image must be less than 5MB",
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only JPG, PNG, and WEBP images are allowed",
  );

const brandIdentitySchema = z.object({
  logoUrl: optionalUrlSchema,
  bannerUrl: optionalUrlSchema,

  logoFile: imageFileSchema,
  bannerFile: imageFileSchema,
});

const generalInfoSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),

  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),

  cuisineTypes: z.array(z.string()).min(1, "Select at least one cuisine"),
});

const contactSchema = z.object({
  contact: z.object({
    phone: z.string().min(6, "Phone number is required"),
    email: optionalEmailSchema,
  }),
});

const addressSchema = z.object({
  address: z.object({
    city: z.string().min(1, "City is required"),
    street: z.string().min(1, "Street is required"),
    building: z.string().min(1, "Building is required"),

    // changed from nullable to empty-string friendly
    floor: optionalTextSchema,

    locationUrl: optionalUrlSchema,
  }),
});

const openingHoursSchema = z.object({
  openingHours: z.array(
    z.object({
      day: z.enum(openingHourDays),
      openTime: z.string(),
      closeTime: z.string(),
      isClosed: z.boolean(),
    }),
  ),
});

export const updateOwnerRestaurantSchema = brandIdentitySchema
  .merge(generalInfoSchema)
  .merge(contactSchema)
  .merge(addressSchema)
  .merge(openingHoursSchema);

export type UpdateOwnerRestaurantFormValues = z.infer<
  typeof updateOwnerRestaurantSchema
>;
