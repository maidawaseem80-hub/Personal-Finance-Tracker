import express from "express";
import { createBudget, getBudgets, updateBudget, deleteBudget } from "../controllers/budget.controller.js";

const router = express.Router();

router.post("/", createBudget);
router.get("/", getBudgets);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;