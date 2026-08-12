import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
         type: Number,
          required: true 
        },
    type: {
         type: String,
          enum: ['income', 'expense'],
           required: true 
        },
    note: {
         type: String,
          trim: true 
        },
    date: {
         type: Date,
          default: Date.now
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

module.exports = mongoose.model('Transaction', transactionSchema);