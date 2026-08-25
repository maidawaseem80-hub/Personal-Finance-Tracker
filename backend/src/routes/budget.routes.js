import express from "express";
import { protect } from "../middleware/auth.js";
import { createBudget, getBudgets, updateBudget, deleteBudget } from "../controllers/budget.controller.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createBudget)
  .get(getBudgets);

router.route("/:id")
  .put(updateBudget)
  .delete(deleteBudget);

export default router;