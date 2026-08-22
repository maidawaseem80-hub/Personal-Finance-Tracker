import { createContext, useContext, useMemo, useState } from "react";

const TransactionContext = createContext(null);

const initialTransactions = [
  {
    id: 1,
    description: "Sample Transaction",
    category: "Food",
    date: "2026-08-20",
    type: "expense",
    amount: 2500,
  },
];

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      description: transaction.description.trim(),
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category.trim(),
      date: transaction.date,
    };

    setTransactions((previous) => [newTransaction, ...previous]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((previous) =>
      previous.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              description: updatedTransaction.description.trim(),
              amount: Number(updatedTransaction.amount),
              type: updatedTransaction.type,
              category: updatedTransaction.category.trim(),
              date: updatedTransaction.date,
            }
          : transaction
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((previous) =>
      previous.filter((transaction) => transaction.id !== id)
    );
  };

  const transactionSummary = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const currentBalance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
    };
  }, [transactions]);

  const value = {
    transactions,
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

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used inside a TransactionProvider"
    );
  }

  return context;
}