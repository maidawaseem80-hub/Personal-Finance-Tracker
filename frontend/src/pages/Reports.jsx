import "./Reports.css";

function Reports() {
  const categoryData = [
    { category: "Food", amount: 12500 },
    { category: "Transport", amount: 8000 },
    { category: "Bills", amount: 15000 },
    { category: "Entertainment", amount: 5000 },
  ];

  const monthlyData = [
    { month: "Jan", income: 70000, expense: 45000 },
    { month: "Feb", income: 75000, expense: 48000 },
    { month: "Mar", income: 70000, expense: 52000 },
    { month: "Apr", income: 80000, expense: 50000 },
    { month: "May", income: 85000, expense: 58000 },
    { month: "Jun", income: 80000, expense: 55000 },
  ];

  const totalIncome = monthlyData.reduce(
    (total, item) => total + item.income,
    0
  );

  const totalExpenses = monthlyData.reduce(
    (total, item) => total + item.expense,
    0
  );

  const totalSavings = totalIncome - totalExpenses;

  const formatAmount = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>Analyze your income, expenses, and spending patterns.</p>
        </div>

        <div className="reports-actions">
          <button type="button" className="export-button">
            Export CSV
          </button>

          <button type="button" className="export-button">
            Export PDF
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="report-summary-card">
          <span>Total Income</span>
          <strong className="income-value">
            {formatAmount(totalIncome)}
          </strong>
        </div>

        <div className="report-summary-card">
          <span>Total Expenses</span>
          <strong className="expense-value">
            {formatAmount(totalExpenses)}
          </strong>
        </div>

        <div className="report-summary-card">
          <span>Total Savings</span>
          <strong className="savings-value">
            {formatAmount(totalSavings)}
          </strong>
        </div>
      </div>

      <div className="reports-grid">
        <section className="report-card">
          <div className="report-card-header">
            <div>
              <h2>Expenses by Category</h2>
              <p>Where your money is being spent</p>
            </div>
          </div>

          <div className="category-list">
            {categoryData.map((item) => (
              <div className="category-row" key={item.category}>
                <div className="category-info">
                  <span>{item.category}</span>
                  <strong>{formatAmount(item.amount)}</strong>
                </div>

                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: `${Math.min(item.amount / 150, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="report-card">
          <div className="report-card-header">
            <div>
              <h2>Monthly Overview</h2>
              <p>Income versus expenses</p>
            </div>
          </div>

          <div className="monthly-list">
            {monthlyData.map((item) => (
              <div className="monthly-row" key={item.month}>
                <div className="monthly-month">{item.month}</div>

                <div className="monthly-values">
                  <span className="monthly-income">
                    + {formatAmount(item.income)}
                  </span>

                  <span className="monthly-expense">
                    - {formatAmount(item.expense)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;