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
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    month: {
      type: Number,
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);