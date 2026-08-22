import express from "express";
import { checkBudgetAlerts , getAlerts } from "../controllers/alert.controller.js";

const router = express.Router();

router.get("/check/:budgetId", checkBudgetAlerts);
router.get("/", getAlerts);

export default router;