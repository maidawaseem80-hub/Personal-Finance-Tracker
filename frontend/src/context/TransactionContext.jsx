import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const TransactionContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function TransactionProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Authentication
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // Fetch All Transactions
  // =========================

  const fetchTransactions = async () => {
    const token = getToken();

    if (!token) {
      setTransactions([]);
      return [];
    }

    try {
      // Request a large limit so dashboard,
      // budgets and reports have complete data.
      const response = await fetch(
        `${API_URL}/transactions?page=1&limit=1000`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch transactions."
        );
      }

      const transactionData = data.data || [];

      setTransactions(transactionData);

      return transactionData;
    } catch (error) {
      console.error(
        "Failed to fetch transactions:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch transactions."
      );

      throw error;
    }
  };

  // =========================
  // Fetch Categories
  // =========================

  const fetchCategories = async () => {
    const token = getToken();

    if (!token) {
      setCategories([]);
      return [];
    }

    try {
      const response = await fetch(
        `${API_URL}/categories`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch categories."
        );
      }

      const categoryData = data.data || [];

      setCategories(categoryData);

      return categoryData;
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch categories."
      );

      throw error;
    }
  };

  // =========================
  // Create Category
  // =========================

  const createCategory = async (name, type) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/categories`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          type,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create category."
      );
    }

    setCategories((currentCategories) => [
      data.data,
      ...currentCategories,
    ]);

    return data.data;
  };

  // =========================
  // Update Category
  // =========================

  const updateCategory = async (
    categoryId,
    categoryData
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryData.name.trim(),
          type: categoryData.type,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update category."
      );
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === categoryId
          ? data.data
          : category
      )
    );

    return data.data;
  };

  // =========================
  // Delete Category
  // =========================

  const deleteCategory = async (categoryId) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete category."
      );
    }

    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) =>
          category._id !== categoryId
      )
    );

    return data;
  };

  // =========================
  // Add Transaction
  // =========================

  const addTransaction = async (
    transactionData
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/transactions`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(transactionData.amount),
          type: transactionData.type,
          category: transactionData.category,
          note:
            transactionData.description?.trim() ||
            transactionData.note?.trim() ||
            "",
          date: transactionData.date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create transaction."
      );
    }

    setTransactions((currentTransactions) => [
      data.data,
      ...currentTransactions,
    ]);

    return data.data;
  };

  // =========================
  // Update Transaction
  // =========================

  const updateTransaction = async (
    transactionId,
    transactionData
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/transactions/${transactionId}`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(transactionData.amount),
          type: transactionData.type,
          category: transactionData.category,
          note:
            transactionData.description?.trim() ||
            transactionData.note?.trim() ||
            "",
          date: transactionData.date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update transaction."
      );
    }

    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction._id === transactionId
          ? data.data
          : transaction
      )
    );

    return data.data;
  };

  // =========================
  // Delete Transaction
  // =========================

  const deleteTransaction = async (
    transactionId
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/transactions/${transactionId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete transaction."
      );
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) =>
          transaction._id !== transactionId
      )
    );

    return data;
  };

  // =========================
  // Load Application Data
  // =========================

  useEffect(() => {
    const loadData = async () => {
      // Wait for AuthContext
      if (authLoading) {
        return;
      }

      // User is logged out
      if (!user) {
        setTransactions([]);
        setCategories([]);
        setLoading(false);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        await Promise.all([
          fetchTransactions(),
          fetchCategories(),
        ]);
      } catch (error) {
        console.error(
          "Failed to load application data:",
          error
        );

        setError(
          error.message ||
            "Failed to load application data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  // =========================
  // Transaction Summary
  // =========================

  const transactionSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );

    const totalExpenses = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(transaction.amount || 0),
        0
      );

    const currentBalance =
      totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
    };
  }, [transactions]);

  // =========================
  // Context Value
  // =========================

  const value = {
    transactions,
    categories,

    loading,
    error,

    fetchTransactions,
    fetchCategories,

    createCategory,
    updateCategory,
    deleteCategory,

    addTransaction,
    updateTransaction,
    deleteTransaction,

    transactionSummary,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used inside a TransactionProvider"
    );
  }

  return context;
}