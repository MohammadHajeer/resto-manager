// src/modules/users/auth-user.model.ts

import mongoose, { Schema } from "mongoose";

const authUserSchema = new Schema(
  {
    name: String,
    email: String,
    emailVerified: Boolean,
    role: String,
    phone: String,
    image: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    collection: "user", // change to "users" if your collection name is users
    strict: false,
  },
);

export const AuthUser =
  mongoose.models.AuthUser || mongoose.model("AuthUser", authUserSchema);
