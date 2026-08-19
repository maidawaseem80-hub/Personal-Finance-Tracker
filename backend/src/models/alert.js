import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    thresholdPercent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model("Alert", alertSchema);