import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="page-content dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your financial overview.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Total Balance</span>
          <h2>$12,450.00</h2>
          <p className="summary-positive">+8.5% this month</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Income</span>
          <h2>$5,200.00</h2>
          <p className="summary-positive">+12.4% this month</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Expenses</span>
          <h2>$2,850.00</h2>
          <p className="summary-negative">+4.2% this month</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Monthly Overview */}
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Monthly Overview</h2>
            <span>Current Month</span>
          </div>

          <div className="overview-placeholder">
            <div className="chart-bars">
              <div style={{ height: "45%" }}></div>
              <div style={{ height: "65%" }}></div>
              <div style={{ height: "50%" }}></div>
              <div style={{ height: "80%" }}></div>
              <div style={{ height: "60%" }}></div>
              <div style={{ height: "90%" }}></div>
              <div style={{ height: "70%" }}></div>
            </div>
          </div>
        </section>

        {/* Budget Summary */}
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Budget Summary</h2>
            <span>This Month</span>
          </div>

          <div className="budget-item">
            <div className="budget-info">
              <span>Food</span>
              <span>$420 / $600</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>

          <div className="budget-item">
            <div className="budget-info">
              <span>Transport</span>
              <span>$180 / $400</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>

          <div className="budget-item">
            <div className="budget-info">
              <span>Entertainment</span>
              <span>$250 / $300</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: "83%" }}
              ></div>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Transactions */}
      <section className="dashboard-card transactions-card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
          <a href="/transactions">View All</a>
        </div>

        <div className="transactions-table">
          <div className="transaction-row transaction-heading">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span>Amount</span>
          </div>

          <div className="transaction-row">
            <span>Aug 20</span>
            <span>Grocery Store</span>
            <span>Food</span>
            <span className="amount-negative">-$85.00</span>
          </div>

          <div className="transaction-row">
            <span>Aug 19</span>
            <span>Salary</span>
            <span>Income</span>
            <span className="amount-positive">+$2,600.00</span>
          </div>

          <div className="transaction-row">
            <span>Aug 18</span>
            <span>Fuel Station</span>
            <span>Transport</span>
            <span className="amount-negative">-$60.00</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;