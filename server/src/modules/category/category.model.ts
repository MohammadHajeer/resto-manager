import { Schema, model, InferSchemaType, Types } from "mongoose";

const categorySchema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ restaurantId: 1 });
categorySchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  restaurantId: Types.ObjectId;
};

const Category = model("Category", categorySchema);

export { Category, type CategoryDocument };
