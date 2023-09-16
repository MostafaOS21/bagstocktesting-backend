import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
