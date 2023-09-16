import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    qunatity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["babys", "girls", "boys", "women", "men"],
    },
    orders: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Product", productSchema);
