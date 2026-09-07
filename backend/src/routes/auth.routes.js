import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.get(
  "/preferences",
  protect,
  getPreferences
);

router.put(
  "/preferences",
  protect,
  updatePreferences
);

// Profile & security
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;