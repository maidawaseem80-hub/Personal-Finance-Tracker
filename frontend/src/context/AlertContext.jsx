import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const AlertContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AlertProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Get Token
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // Fetch Alerts
  // =========================

  const fetchAlerts = async () => {
    const token = getToken();

    if (!token) {
      setAlerts([]);
      return [];
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notifications.");
      }

      const alertData = Array.isArray(data.data) ? data.data : [];

      setAlerts(alertData);

      return alertData;
    } catch (error) {
      console.error("Failed to load alerts:", error);

      setError(error.message || "Failed to load notifications.");

      setAlerts([]);

      return [];
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Mark Alerts As Read
  // =========================

  const markAlertsAsRead = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/alerts/mark-read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) => ({
          ...alert,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark alerts as read:", error);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAlerts([]);
      setError("");
      return;
    }

    fetchAlerts();
  }, [user, authLoading]);

  // =========================
  // Listen For New Alerts
  // =========================

  useEffect(() => {
    const handleAlertsChanged = async () => {
      console.log("Refreshing notifications...");
      await fetchAlerts();
    };

    window.addEventListener("alertsChanged", handleAlertsChanged);

    return () => {
      window.removeEventListener("alertsChanged", handleAlertsChanged);
    };
  }, []);

  // =========================
  // Unread Count
  // =========================

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  // =========================
  // Context Value
  // =========================

  const value = {
    alerts,
    loading,
    error,
    unreadCount,

    fetchAlerts,
    markAlertsAsRead,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useAlerts() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlerts must be used inside an AlertProvider");
  }

  return context;
}