import { Schema, model, InferSchemaType, Types } from "mongoose";

const orderAddonSchema = new Schema(
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
    },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    selectedAddons: {
      type: [orderAddonSchema],
      default: [],
    },

    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const deliveryAddressSchema = new Schema(
  {
    label: {
      type: String,
      trim: true,
      default: "",
    },

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

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items: unknown[]) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    customerNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
};

const Order = model("Order", orderSchema);

export { Order, type OrderDocument };
