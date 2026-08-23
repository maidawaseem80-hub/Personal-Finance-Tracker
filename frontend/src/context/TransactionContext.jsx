import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const TransactionContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the current user's token.
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Common headers used for authenticated requests.
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
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/transactions`,
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

      setTransactions(data.data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);

      setError(
        error.message || "Failed to fetch transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch Categories
  // =========================

  const fetchCategories = async () => {
    const token = getToken();

    if (!token) {
      setCategories([]);
      return;
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

      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      setError(
        error.message || "Failed to fetch categories."
      );
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
        data.message || "Failed to create category."
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
        data.message || "Failed to update category."
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
        data.message || "Failed to delete category."
      );
    }

    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => category._id !== categoryId
      )
    );

    return data;
  };

  // =========================
  // Add Transaction
  // =========================

  const addTransaction = async (transactionData) => {
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
          note: transactionData.description?.trim() || "",
          date: transactionData.date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create transaction."
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
          note: transactionData.description?.trim() || "",
          date: transactionData.date,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update transaction."
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
      throw new Error(
        data.message || "Failed to delete transaction."
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
  // Load Initial Data
  // =========================

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchTransactions(),
        fetchCategories(),
      ]);
    };

    loadData();
  }, []);

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
          total + Number(transaction.amount || 0),
        0
      );

    const totalExpenses = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
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