import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
} from "./common.schema.js";

export const userRoleSchema = z.enum(["admin", "restaurant_owner", "customer"]);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const customerRegistrationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional().or(z.literal("")),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema.optional().or(z.literal("")),
  image: z
    .string()
    .trim()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerRegistrationInput = z.infer<
  typeof customerRegistrationSchema
>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
