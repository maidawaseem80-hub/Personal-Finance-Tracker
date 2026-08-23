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
        throw new Error(data.message || "Failed to fetch transactions.");
      }

      setTransactions(data.data || []);
    } catch (error) {
      setError(error.message || "Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const transactionSummary = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const currentBalance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
    };
  }, [transactions]);

  const value = {
    transactions,
    loading,
    error,
    fetchTransactions,
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