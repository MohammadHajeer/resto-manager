import { Schema, model, InferSchemaType } from "mongoose";

const openingHourSchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    openTime: {
      type: String,
      required: true,
      trim: true,
    },
    closeTime: {
      type: String,
      required: true,
      trim: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const restaurantSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    logoUrl: {
      type: String,
      trim: true,
      default: null,
    },

    bannerUrl: {
      type: String,
      trim: true,
      default: null,
    },

    contact: {
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      },
    },

    address: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      building: {
        type: String,
        required: true,
        trim: true,
      },
      floor: {
        type: String,
        trim: true,
        default: "",
      },
      locationUrl: {
        type: String,
        trim: true,
        default: null,
      },
    },

    openingHours: {
      type: [openingHourSchema],
      default: [],
    },

    cuisineTypes: {
      type: [String],
      required: true,
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },

    isOpen: {
      type: Boolean,
      default: false,
    },

    verification: {
      businessLicensePath: {
        type: String,
        trim: true,
        required: true,
      },
      ownerIdDocumentPath: {
        type: String,
        trim: true,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
      reviewedBy: {
        type: String,
        default: null,
      },
      rejectionReason: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ status: 1 });
restaurantSchema.index({ name: "text", description: "text" });

type RestaurantDocument = InferSchemaType<typeof restaurantSchema>;

const Restaurant = model("Restaurant", restaurantSchema);

export { Restaurant, type RestaurantDocument };
