import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },

    month: {
      type: Number,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Budget ||
  mongoose.model("Budget", budgetSchema);