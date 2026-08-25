import Budget from "../models/budget.js";

const createBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;
    const user = req.user._id;

    if (!amount || !period) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const budget = await Budget.create({
      user,
      category: category || null,
      amount,
      period,
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const user = req.user._id;
    const budgets = await Budget.find({ user });
    res.status(200).json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createBudget, getBudgets, updateBudget, deleteBudget };