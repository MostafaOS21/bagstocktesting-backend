import { Schema, model, ObjectId } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "expired"],
      default: "pending",
    },
    numberOfDelivers: {
      default: 10,
      type: Number,
    },
    totoalOrders: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
    },
    lastUpdate: Date,
    specialNumber: Number,
  },
  { timestamps: true }
);

export default model("User", userSchema);
