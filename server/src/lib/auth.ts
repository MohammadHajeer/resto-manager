import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;
const betterAuthUrl = process.env.BETTER_AUTH_URL;
const isProduction = process.env.NODE_ENV === "production";

const productionOrigins = (process.env.CLIENT_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!mongoUri) {
  throw new Error("MONGO_URI is missing");
}

if (!betterAuthUrl) {
  throw new Error("BETTER_AUTH_URL is missing");
}

if (isProduction && productionOrigins.length === 0) {
  throw new Error("CLIENT_ORIGINS is missing in production");
}

export const authMongoClient = new MongoClient(mongoUri);
export const authDb = authMongoClient.db();

export const auth = betterAuth({
  database: mongodbAdapter(authDb, {
    client: authMongoClient,
  }),

  // The public URL of your Render backend.
  // Better Auth automatically uses /api/auth as its default auth path.
  baseURL: betterAuthUrl,

  trustedOrigins: isProduction
    ? productionOrigins
    : [
        "http://localhost:*",
        "http://127.0.0.1:*",
      ],

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

  // Required while the frontend and backend use unrelated domains:
  // your-app.netlify.app → your-api.onrender.com
  ...(isProduction && {
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none" as const,
        secure: true,
        partitioned: true,
      },
    },
  }),
});