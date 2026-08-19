import mongoose from "mongoose";
import user from "../models/user.js";

const alertSchema = new mongoose.Schema(
  {
    message: {
         type: String,
          required: true 
        },
    isRead: {
         type: Boolean,
          default: false
         },
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true 
        },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
