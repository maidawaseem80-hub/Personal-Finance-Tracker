const express = require("express");
const router = express.Router();
const { createBudget, getBudgets, updateBudget, deleteBudget } = require("../controllers/budgetController");

router.post("/", createBudget);
router.get("/", getBudgets);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
