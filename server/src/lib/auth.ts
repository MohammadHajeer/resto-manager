import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is missing");
}

export const authMongoClient = new MongoClient(mongoUri);
export const authDb = authMongoClient.db();

export const auth = betterAuth({
  database: mongodbAdapter(authDb, {
    client: authMongoClient,
  }),

  trustedOrigins: [process.env.CLIENT_URL ?? "http://localhost:5173", "http://localhost:5174"],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 100,
  },

  user: {
    additionalFields: {
      role: {
        type: ["admin", "restaurant_owner", "customer"],
        required: false,
        defaultValue: "customer",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
});