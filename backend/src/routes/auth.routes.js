import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  getPreferences,
  updatePreferences,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// =========================================================
// Authentication
// =========================================================

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/me",
  protect,
  getMe
);

// =========================================================
// Password Reset
// =========================================================

router.post(
  "/forgot-password",
  forgotPassword
);

router.put(
  "/reset-password/:token",
  resetPassword
);

// =========================================================
// Profile & Security
// =========================================================

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/password",
  protect,
  changePassword
);

// =========================================================
// Preferences
// =========================================================

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

export default router;