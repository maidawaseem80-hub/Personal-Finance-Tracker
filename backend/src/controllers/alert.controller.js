import Budget from "../models/budget.js";
import Transaction from "../models/transaction.js";
import Alert from "../models/alert.js";

const checkBudgetAlerts = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const now = new Date();
    let startDate;

    if (budget.period === "weekly") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (budget.period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (budget.period === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const filter = {
      user: budget.user,
      type: "expense",
      date: { $gte: startDate },
    };
    if (budget.category) {
      filter.category = budget.category;
    }

    const transactions = await Transaction.find(filter);
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    const percentUsed = (totalSpent / budget.amount) * 100;

    let thresholdHit = null;
    if (percentUsed >= 100) {
      thresholdHit = 100;
    } else if (percentUsed >= 80) {
      thresholdHit = 80;
    }

    let alertCreated = null;

    if (thresholdHit) {
      // Check if an alert for this budget + threshold already exists in the current period
      const existingAlert = await Alert.findOne({
        budget: budget._id,
        thresholdPercent: thresholdHit,
        createdAt: { $gte: startDate },
      });

      if (!existingAlert) {
        const message =
          thresholdHit === 100
            ? `You have exceeded your budget limit of ${budget.amount}.`
            : `You have used ${percentUsed.toFixed(0)}% of your budget.`;

        alertCreated = await Alert.create({
          user: budget.user,
          budget: budget._id,
          thresholdPercent: thresholdHit,
          message,
        });
      }
    }

    res.status(200).json({
      totalSpent,
      budgetAmount: budget.amount,
      percentUsed: percentUsed.toFixed(1),
      alertCreated,
      alertAlreadyExisted: thresholdHit && !alertCreated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }

    const alerts = await Alert.find({ user }).sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { checkBudgetAlerts , getAlerts };