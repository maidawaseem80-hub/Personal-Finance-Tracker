import "./Transactions.css";

function Transactions() {
  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p>View and manage your financial transactions.</p>
        </div>

        <button className="add-transaction-button" type="button">
          + Add Transaction
        </button>
      </div>

      <div className="transactions-content">
        <div className="transactions-filters">
          <input
            type="text"
            placeholder="Search transactions..."
          />

          <select defaultValue="all">
            <option value="all">All Transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Sample Transaction</td>
                <td>Food</td>
                <td>20 Aug 2026</td>
                <td>Expense</td>
                <td>- Rs. 2,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;