import { z } from "zod";
import type { FieldPath } from "react-hook-form";
import {
  restaurantRegistrationSchema,
  type RestaurantRegistrationInput,
} from "@restomanager/validators";

export const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];

const optionalImageFileSchema = z
  .custom<File | null | undefined>(
    (file) => file == null || file instanceof File,
    "Please upload a valid image file",
  )
  .refine((file) => !file || IMAGE_TYPES.includes(file.type), {
    message: "Images must be JPG, PNG, or WEBP",
  })
  .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
    message: "Image must be 5MB or smaller",
  });

const optionalDocumentFileSchema = z
  .custom<File | null | undefined>(
    (file) => file == null || file instanceof File,
    "Please upload a valid file",
  )
  .refine((file) => !file || DOCUMENT_TYPES.includes(file.type), {
    message: "License must be a PDF or image file",
  })
  .refine((file) => !file || file.size <= MAX_DOCUMENT_SIZE, {
    message: "License must be 10MB or smaller",
  });

const restaurantRegisterBaseSchema = restaurantRegistrationSchema.extend({
  uploads: z.object({
    logo: optionalImageFileSchema,
    banner: optionalImageFileSchema,
    businessLicense: optionalDocumentFileSchema,
  }),
  brandPrimaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Enter a valid hex color"),

});

export const restaurantRegisterFormSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  const formValue = value as Record<string, unknown>;
  const restaurant =
    formValue.restaurant && typeof formValue.restaurant === "object"
      ? (formValue.restaurant as Record<string, unknown>)
      : {};
  const slug =
    typeof restaurant.slug === "string" ? restaurant.slug.trim() : "";

  return {
    ...formValue,
    restaurant: {
      ...restaurant,
      slug: slug || undefined,
    },
  };
}, restaurantRegisterBaseSchema);

export type RestaurantRegisterFormValues = z.infer<
  typeof restaurantRegisterFormSchema
>;

export type PersistedRestaurantRegisterValues = Omit<
  RestaurantRegisterFormValues,
  "uploads"
> & {
  uploads: {
    logo: null;
    banner: null;
    businessLicense: null;
  };
};

export type RestaurantRegisterSubmitData = RestaurantRegistrationInput & {
  uploads: RestaurantRegisterFormValues["uploads"];
  brandPrimaryColor: string;
};

export const totalSteps = 4;

export const stepFields: Record<
  number,
  FieldPath<RestaurantRegisterFormValues>[]
> = {
  1: [
    "owner.name",
    "owner.email",
    "owner.phone",
    "owner.password",
    "owner.confirmPassword",
  ],
  2: [
    "restaurant.name",
    "restaurant.description",
    "restaurant.cuisineTypes.0",
    "contact.phone",
    "contact.email",
    "address.city",
    "address.street",
    "address.building",
    "address.floor",
    "address.locationUrl",
  ],
  3: [
    "uploads.logo",
    "uploads.banner",
    "uploads.businessLicense",
    "brandPrimaryColor",
  ],
  4: [],
};

export const fieldStepMap: Array<{
  step: number;
  fields: FieldPath<RestaurantRegisterFormValues>[];
}> = [
  { step: 1, fields: stepFields[1] },
  { step: 2, fields: stepFields[2] },
  { step: 3, fields: stepFields[3] },
];

export const defaultValues: RestaurantRegisterFormValues = {
  owner: {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  },
  restaurant: {
    name: "",
    description: "",
    cuisineTypes: [""],
  },
  contact: {
    phone: "",
    email: "",
  },
  address: {
    city: "",
    street: "",
    building: "",
    floor: "",
    locationUrl: "",
  },
  branding: {
    logoUrl: "",
    bannerUrl: "",
  },
  verification: {
    businessLicenseUrl: "",
    ownerIdDocumentUrl: "",
  },
  uploads: {
    logo: null,
    banner: null,
    businessLicense: null,
  },
  brandPrimaryColor: "#00694d",
};

export function sanitizeForPersistence(
  values: RestaurantRegisterFormValues,
): PersistedRestaurantRegisterValues {
  return {
    ...values,
    owner: {
      ...values.owner,
      password: "",
      confirmPassword: "",
    },
    uploads: {
      logo: null,
      banner: null,
      businessLicense: null,
    },
  };
}

export function mergePersistedValues(
  persisted?: PersistedRestaurantRegisterValues | null,
): RestaurantRegisterFormValues {
  if (!persisted) {
    return defaultValues;
  }

  return {
    ...defaultValues,
    ...persisted,
    owner: {
      ...defaultValues.owner,
      ...persisted.owner,
      password: "",
      confirmPassword: "",
    },
    restaurant: {
      ...defaultValues.restaurant,
      ...persisted.restaurant,
      slug: persisted.restaurant.slug?.trim() || undefined,
      cuisineTypes:
        persisted.restaurant.cuisineTypes.length > 0
          ? persisted.restaurant.cuisineTypes
          : defaultValues.restaurant.cuisineTypes,
    },
    contact: {
      ...defaultValues.contact,
      ...persisted.contact,
    },
    address: {
      ...defaultValues.address,
      ...persisted.address,
    },
    branding: {
      ...defaultValues.branding,
      ...persisted.branding,
    },
    verification: {
      ...defaultValues.verification,
      ...persisted.verification,
    },
    uploads: defaultValues.uploads,
  };
}

export function toSubmitData(
  data: RestaurantRegisterFormValues,
): RestaurantRegisterSubmitData {
  return {
    owner: data.owner,
    restaurant: {
      ...data.restaurant,
      slug: data.restaurant.slug?.trim() || undefined,
    },
    contact: data.contact,
    address: data.address,
    branding: data.branding,
    verification: data.verification,
    uploads: data.uploads,
    brandPrimaryColor: data.brandPrimaryColor,
  };
}
