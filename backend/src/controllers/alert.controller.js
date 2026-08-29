import Alert from "../models/alert.js";

// =========================
// Get User Alerts
// =========================

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      user: req.user._id,
    })
      .populate("budget", "amount period category")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch alerts.",
    });
  }
};

// =========================
// Mark Alerts As Read
// =========================

const markAlertsAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All alerts marked as read.",
    });
  } catch (error) {
    console.error("Mark alerts as read error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark alerts as read.",
    });
  }
};

export {
  getAlerts,
  markAlertsAsRead,
};