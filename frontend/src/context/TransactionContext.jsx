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
  // Fetch Transactions
  // =========================

  const fetchTransactions = async () => {
    const token = getToken();

    if (!token) {
      setTransactions([]);
      return [];
    }

    try {
      const response = await fetch(
        `${API_URL}/transactions?limit=1000`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch transactions."
        );
      }

      const transactionData = Array.isArray(data.data)
        ? data.data
        : [];

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

      setTransactions([]);

      return [];
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
          data.message || "Failed to fetch categories."
        );
      }

      const categoryData = Array.isArray(data.data)
        ? data.data
        : [];

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

      setCategories([]);

      return [];
    }
  };

  // =========================
  // Create Category
  // =========================

  const createCategory = async (
    nameOrData,
    type
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    // Supports both:
    // createCategory("Salary", "income")
    // createCategory({ name: "Salary", type: "income" })

    const name =
      typeof nameOrData === "object"
        ? nameOrData?.name
        : nameOrData;

    const categoryType =
      typeof nameOrData === "object"
        ? nameOrData?.type
        : type;

    const trimmedName = String(
      name || ""
    ).trim();

    if (!trimmedName) {
      throw new Error("Category name is required.");
    }

    if (
      categoryType !== "income" &&
      categoryType !== "expense"
    ) {
      throw new Error(
        "Category type must be income or expense."
      );
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
          name: trimmedName,
          type: categoryType,
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

    const newCategory = data.data;

    setCategories((currentCategories) => [
      newCategory,
      ...currentCategories,
    ]);

    return newCategory;
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

    const name = String(
      categoryData?.name || ""
    ).trim();

    const type = categoryData?.type;

    if (!name) {
      throw new Error("Category name is required.");
    }

    if (
      type !== "income" &&
      type !== "expense"
    ) {
      throw new Error(
        "Category type must be income or expense."
      );
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
          name,
          type,
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

    const updatedCategory = data.data;

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === categoryId
          ? updatedCategory
          : category
      )
    );

    return updatedCategory;
  };

  // =========================
  // Delete Category
  // =========================

  const deleteCategory = async (
    categoryId
  ) => {
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
  // Load All Data
  // =========================

  const fetchAllData = async () => {
    const token = getToken();

    if (!token) {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
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
        "Failed to load transaction data:",
        error
      );

      setError(
        error.message ||
          "Failed to load transaction data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Add Transaction
  // =========================

    const addTransaction = async (transactionData) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(transactionData.amount),
        type: transactionData.type,
        category: transactionData.category,
        note: transactionData.note || transactionData.description || "",
        date: transactionData.date,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add transaction.");
    }

    let newTransaction = data.data;

    try {
      const refreshed = await fetchTransactions();

      const createdTransaction = refreshed.find(
        (transaction) => transaction._id === newTransaction?._id
      );

      if (createdTransaction) {
        newTransaction = createdTransaction;
      }
    } catch (error) {
      console.error("Failed to refresh transactions:", error);

      setTransactions((current) => [newTransaction, ...current]);
    }

    if (transactionData.type === "expense") {
      window.dispatchEvent(new Event("alertsChanged"));
    }

    return newTransaction;
  };

  // =========================
  // Update Transaction
  // =========================

    const updateTransaction = async (transactionId, transactionData) => {
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
          note: transactionData.note || transactionData.description || "",
          date: transactionData.date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update transaction.");
    }

    setTransactions((current) =>
      current.map((transaction) =>
        transaction._id === transactionId ? data.data : transaction
      )
    );

    window.dispatchEvent(new Event("alertsChanged"));

    return data.data;
  };

  // =========================
  // Delete Transaction
  // =========================

    const deleteTransaction = async (transactionId) => {
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
      throw new Error(data.message || "Failed to delete transaction.");
    }

    setTransactions((current) =>
      current.filter((transaction) => transaction._id !== transactionId)
    );

    window.dispatchEvent(new Event("alertsChanged"));

    return data;
  };

  // =========================
  // Load After Authentication
  // =========================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
      setError("");
      return;
    }

    fetchAllData();
  }, [user, authLoading]);

    // =========================
  // Transaction Summary
  // =========================

  const transactionSummary = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

    const currentBalance = totalIncome - totalExpenses;

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
    fetchAllData,

    // Transaction functions
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Category functions
    createCategory,
    updateCategory,
    deleteCategory,
    transactionSummary,
  };

  return (
    <TransactionContext.Provider
      value={value}
    >
      {children}
    </TransactionContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useTransactions() {
  const context = useContext(
    TransactionContext
  );

  if (!context) {
    throw new Error(
      "useTransactions must be used inside a TransactionProvider"
    );
  }

  return context;
}