import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const BudgetContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function BudgetProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [budgets, setBudgets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Get Authentication Token
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // Common Auth Headers
  // =========================

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // Fetch Budgets
  // =========================

  const fetchBudgets = async () => {
    const token = getToken();

    if (!token) {
      setBudgets([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/budgets`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch budgets."
        );
      }

      setBudgets(data.data || []);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);

      setError(
        error.message || "Failed to fetch budgets."
      );
    }
  };

  // =========================
  // Create Budget
  // =========================

  const createBudget = async (budgetData) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(`${API_URL}/budgets`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(budgetData.amount),
        period: budgetData.period,
        category: budgetData.category || null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save budget."
      );
    }

    setBudgets((currentBudgets) => [
      data.data,
      ...currentBudgets,
    ]);

    return data.data;
  };

  // =========================
  // Update Budget
  // =========================

  const updateBudget = async (budgetId, budgetData) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/budgets/${budgetId}`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(budgetData.amount),
          period: budgetData.period,
          category: budgetData.category || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to save budget."
      );
    }

    setBudgets((currentBudgets) =>
      currentBudgets.map((budget) =>
        budget._id === budgetId ? data.data : budget
      )
    );

    return data.data;
  };

  // =========================
  // Delete Budget
  // =========================

  const deleteBudget = async (budgetId) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/budgets/${budgetId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete budget."
      );
    }

    setBudgets((currentBudgets) =>
      currentBudgets.filter(
        (budget) => budget._id !== budgetId
      )
    );

    return data;
  };

  // =========================
  // Load Data After Authentication
  // =========================

  useEffect(() => {
    const loadData = async () => {
      // Wait until AuthContext finishes checking
      // the existing session.
      if (authLoading) {
        return;
      }

      // User is not logged in.
      if (!user) {
        setBudgets([]);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        await fetchBudgets();
      } catch (error) {
        console.error(
          "Failed to load budgets:",
          error
        );

        setError(
          error.message || "Failed to load budgets."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  // =========================
  // Context Value
  // =========================

  const value = {
    budgets,

    loading,
    error,

    fetchBudgets,

    createBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useBudgets() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error(
      "useBudgets must be used inside a BudgetProvider"
    );
  }

  return context;
}