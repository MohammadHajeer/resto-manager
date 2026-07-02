import { z } from "zod";
export declare const userRoleSchema: z.ZodEnum<{
    admin: "admin";
    restaurant_owner: "restaurant_owner";
    customer: "customer";
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const customerRegistrationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerRegistrationInput = z.infer<typeof customerRegistrationSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
