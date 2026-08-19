import Budget from "../models/budget.js";

const createBudget = async (req, res) => {
  try {
    const { user, category, amount, period } = req.body;

    if (!user || !amount || !period) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const budget = await Budget.create({
      user,
      category: category || null,
      amount,
      period,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }

    const budgets = await Budget.find({ user });

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

export { createBudget, getBudgets, updateBudget, deleteBudget };