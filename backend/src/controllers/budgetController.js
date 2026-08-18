const Budget = require("../models/Budget");

const createBudget = async (req, res) => {
  try {
    const { userId, categoryId, limitAmount, month, year } = req.body;

    if (!userId || !limitAmount || !month || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const budget = await Budget.create({
      userId,
      categoryId: categoryId || null,
      limitAmount,
      month,
      year,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" }); 
    }

    const budgets = await Budget.find({ userId });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByIdAndDelete(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBudget , getBudgets , updateBudget , deleteBudget };