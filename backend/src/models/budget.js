import mongoose from "mongoose";
import user from "../models/user.js";

const budgetSchema = new mongoose.Schema(
  {
    amount: {
         type: Number,
          required: true
         },
    period: {
         type: String,
          enum: ['weekly', 'monthly', 'yearly'],
           required: true
         },
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true 
        },
    category: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
           required: true 
        },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);