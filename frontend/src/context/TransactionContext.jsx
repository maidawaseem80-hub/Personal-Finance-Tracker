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

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch transactions."
        );
      }

      setTransactions(data.data || []);
    } catch (error) {
      setError(
        error.message || "Failed to fetch transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCategories([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch categories."
        );
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const createCategory = async (name, type) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        type,
      }),
    });

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

  const updateCategory = async (categoryId, name, type) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const transactionSummary = useMemo(() => {
    const totalIncome = transactions
      .filter(
        (transaction) => transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const totalExpenses = transactions
      .filter(
        (transaction) => transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const currentBalance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
    };
  }, [transactions]);

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
    transactionSummary,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used inside a TransactionProvider"
    );
  }

  return context;
}