import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    default: true,
  },
});

export default model("Refresh_Token", refreshTokenSchema);
