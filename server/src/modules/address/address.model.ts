import { Schema, model, InferSchemaType, Types } from "mongoose";

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    street: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    building: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    floor: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

addressSchema.index({ userId: 1, createdAt: -1 });

addressSchema.index(
  { userId: 1, isDefault: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDefault: true,
    },
  },
);

type AddressDocument = InferSchemaType<typeof addressSchema> & {
  userId: Types.ObjectId;
};

const Address = model("Address", addressSchema);

export { Address, type AddressDocument };