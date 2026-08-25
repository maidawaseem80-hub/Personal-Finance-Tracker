import { useEffect, useState } from "react";
import "./Reports.css";

const API_URL = import.meta.env.VITE_API_URL;

function Reports() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchReportsData = async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/summary`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/dashboard/by-category`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/dashboard/monthly-trend`, { headers: getAuthHeaders() }),
      ]);

      const summaryJson = await summaryRes.json();
      const categoryJson = await categoryRes.json();
      const monthlyJson = await monthlyRes.json();

      if (!summaryRes.ok) throw new Error(summaryJson.message || "Failed to load summary.");
      if (!categoryRes.ok) throw new Error(categoryJson.message || "Failed to load category data.");
      if (!monthlyRes.ok) throw new Error(monthlyJson.message || "Failed to load monthly data.");

      setSummary(summaryJson);
      setCategoryData(categoryJson.data || []);
      setMonthlyData(monthlyJson.data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setError(error.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const formatAmount = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const handleExportCSV = () => {
    window.open(`${API_URL}/export/csv?token=${getToken()}`, "_blank");
  };

  const handleExportPDF = () => {
    window.open(`${API_URL}/export/pdf?token=${getToken()}`, "_blank");
  };

  const maxCategoryAmount = Math.max(...categoryData.map((item) => item.total), 1);

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p>Analyze your income, expenses, and spending patterns.</p>
          </div>
        </div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>Analyze your income, expenses, and spending patterns.</p>
        </div>

        <div className="reports-actions">
          <button type="button" className="export-button" onClick={handleExportCSV}>
            Export CSV
          </button>

          <button type="button" className="export-button" onClick={handleExportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <div className="report-summary">
        <div className="report-summary-card">
          <span>Total Income</span>
          <strong className="income-value">{formatAmount(summary.totalIncome)}</strong>
        </div>

        <div className="report-summary-card">
          <span>Total Expenses</span>
          <strong className="expense-value">{formatAmount(summary.totalExpense)}</strong>
        </div>

        <div className="report-summary-card">
          <span>Total Savings</span>
          <strong className="savings-value">{formatAmount(summary.balance)}</strong>
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
            {categoryData.length > 0 ? (
              categoryData.map((item) => (
                <div className="category-row" key={item.category}>
                  <div className="category-info">
                    <span>{item.category}</span>
                    <strong>{formatAmount(item.total)}</strong>
                  </div>

                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${(item.total / maxCategoryAmount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No expense data yet.</p>
            )}
          </div>
        </section>

        <section className="report-card">
          <div className="report-card-header">
            <div>
              <h2>Monthly Overview</h2>
              <p>Expense trend by month</p>
            </div>
          </div>

          <div className="monthly-list">
            {monthlyData.length > 0 ? (
              monthlyData.map((item) => (
                <div className="monthly-row" key={`${item.year}-${item.month}`}>
                  <div className="monthly-month">{item.monthName}</div>

                  <div className="monthly-values">
                    <span className="monthly-expense">
                      - {formatAmount(item.total)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No monthly data yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;