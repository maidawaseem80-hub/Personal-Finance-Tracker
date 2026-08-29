import express from "express";

import {
  getAlerts,
  markAlertsAsRead,
} from "../controllers/alert.controller.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAlerts);
router.put("/mark-read", protect, markAlertsAsRead);

export default router;