import { useMemo } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useTransactions } from "../context/TransactionContext";

function Dashboard() {
  const { transactions, transactionSummary } = useTransactions();

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);

      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    });
  }, [transactions]);

  const monthlyIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const monthlyExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const categorySummary = useMemo(() => {
    const categories = {};

    currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        if (!categories[transaction.category]) {
          categories[transaction.category] = 0;
        }

        categories[transaction.category] += transaction.amount;
      });

    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [currentMonthTransactions]);

  const maxCategoryAmount =
    categorySummary.length > 0
      ? Math.max(...categorySummary.map(([, amount]) => amount))
      : 0;

  const chartData = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dateString = date.toISOString().split("T")[0];

      const dailyExpenses = transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.date === dateString
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

      days.push({
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        amount: dailyExpenses,
      });
    }

    return days;
  }, [transactions]);

  const maxChartAmount = Math.max(
    ...chartData.map((item) => item.amount),
    1
  );

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="page-content dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your financial overview.</p>
        </div>

        <Link to="/transactions" className="dashboard-add-button">
          + Add Transaction
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Balance</span>

            <div className="summary-icon balance-summary-icon">
              Rs
            </div>
          </div>

          <h2
            className={
              transactionSummary.currentBalance >= 0
                ? "summary-balance-positive"
                : "summary-balance-negative"
            }
          >
            {formatCurrency(transactionSummary.currentBalance)}
          </h2>

          <p className="summary-description">
            Current available balance
          </p>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Income</span>

            <div className="summary-icon income-summary-icon">
              ↑
            </div>
          </div>

          <h2 className="summary-income">
            {formatCurrency(transactionSummary.totalIncome)}
          </h2>

          <p className="summary-description">
            All recorded income
          </p>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Expenses</span>

            <div className="summary-icon expense-summary-icon">
              ↓
            </div>
          </div>

          <h2 className="summary-expense">
            {formatCurrency(transactionSummary.totalExpenses)}
          </h2>

          <p className="summary-description">
            All recorded expenses
          </p>
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="dashboard-grid">
        {/* Monthly Overview */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Monthly Overview</h2>
              <p>Expenses from the last 7 days</p>
            </div>

            <span className="card-header-badge">This Month</span>
          </div>

          <div className="overview-chart">
            {chartData.map((item, index) => {
              const height =
                item.amount === 0
                  ? 5
                  : Math.max(
                      (item.amount / maxChartAmount) * 100,
                      8
                    );

              return (
                <div
                  className="chart-column"
                  key={`${item.label}-${index}`}
                >
                  <div className="chart-value">
                    {item.amount > 0
                      ? item.amount.toLocaleString()
                      : ""}
                  </div>

                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>

                  <span className="chart-label">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="monthly-statistics">
            <div>
              <span>Monthly Income</span>

              <strong className="monthly-income">
                {formatCurrency(monthlyIncome)}
              </strong>
            </div>

            <div>
              <span>Monthly Expenses</span>

              <strong className="monthly-expense">
                {formatCurrency(monthlyExpenses)}
              </strong>
            </div>
          </div>
        </section>

        {/* Spending by Category */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Spending by Category</h2>
              <p>Your biggest expense categories</p>
            </div>
          </div>

          {categorySummary.length > 0 ? (
            <div className="category-list">
              {categorySummary.map(([category, amount]) => {
                const percentage =
                  maxCategoryAmount > 0
                    ? (amount / maxCategoryAmount) * 100
                    : 0;

                return (
                  <div className="category-item" key={category}>
                    <div className="category-info">
                      <span>{category}</span>

                      <strong>{formatCurrency(amount)}</strong>
                    </div>

                    <div className="category-progress">
                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <div className="empty-state-icon">₨</div>

              <h3>No expenses yet</h3>

              <p>
                Add an expense to see your spending by category.
              </p>

              <Link to="/transactions">
                Add Transaction
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Recent Transactions */}
      <section className="dashboard-card transactions-card">
        <div className="card-header">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your latest financial activity</p>
          </div>

          <Link to="/transactions">View All</Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="dashboard-transactions-table">
            <div className="dashboard-transaction-row dashboard-transaction-heading">
              <span>Date</span>
              <span>Description</span>
              <span>Category</span>
              <span>Type</span>
              <span>Amount</span>
            </div>

            {recentTransactions.map((transaction) => (
              <div
                className="dashboard-transaction-row"
                key={transaction.id}
              >
                <span>{formatDate(transaction.date)}</span>

                <span className="dashboard-transaction-description">
                  {transaction.description}
                </span>

                <span>{transaction.category}</span>

                <span>
                  <span
                    className={`dashboard-transaction-type ${transaction.type}`}
                  >
                    {transaction.type === "income"
                      ? "Income"
                      : "Expense"}
                  </span>
                </span>

                <span
                  className={`dashboard-transaction-amount ${
                    transaction.type === "income"
                      ? "amount-positive"
                      : "amount-negative"
                  }`}
                >
                  <span className="amount-sign">
                    {transaction.type === "income" ? "+" : "-"}
                  </span>

                  <span className="amount-value">
                    {formatCurrency(transaction.amount)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-transactions">
            <h3>No transactions yet</h3>

            <p>
              Start tracking your finances by adding your first
              transaction.
            </p>

            <Link to="/transactions">
              + Add Transaction
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;