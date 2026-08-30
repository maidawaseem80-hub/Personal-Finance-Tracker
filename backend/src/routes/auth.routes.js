// import express from 'express';
// import {
//   registerUser,
//   loginUser,
//   getMe,
//   forgotPassword,
//   resetPassword,
// } from '../controllers/auth.controller.js';
// import { validate } from '../middleware/validate.js';
// import { protect } from '../middleware/auth.js';
// import {
//   registerSchema,
//   loginSchema,
//   forgotPasswordSchema,
//   resetPasswordSchema,
// } from '../validators/auth.validators.js';

// const router = express.Router();

// router.post('/register', validate(registerSchema), registerUser);
// router.post('/login', validate(loginSchema), loginUser);
// router.get('/me', protect, getMe);
// router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
// router.put('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// export default router;
import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);

router.post("/forgot-password", forgotPassword);

// IMPORTANT
router.put("/reset-password/:token", resetPassword);

export default router;