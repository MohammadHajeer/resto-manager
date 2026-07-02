import { Schema, model, InferSchemaType, Types } from "mongoose";

const addonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
  },
  { _id: false },
);

const menuItemSchema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },

    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    availableAddons: {
      type: [addonSchema],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

menuItemSchema.index({ restaurantId: 1 });
menuItemSchema.index({ categoryId: 1 });
menuItemSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });
menuItemSchema.index({ name: "text", description: "text" });

type MenuItemDocument = InferSchemaType<typeof menuItemSchema> & {
  restaurantId: Types.ObjectId;
  categoryId: Types.ObjectId;
};

const MenuItem = model("MenuItem", menuItemSchema);

export { MenuItem, type MenuItemDocument };
