import { useMemo, useState } from "react";
import "./Budgets.css";

function Budgets() {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: "Food",
      budget: 30000,
      spent: 18500,
    },
    {
      id: 2,
      category: "Transport",
      budget: 15000,
      spent: 7200,
    },
    {
      id: 3,
      category: "Entertainment",
      budget: 10000,
      spent: 8500,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    budget: "",
    spent: "",
  });

  const budgetSummary = useMemo(() => {
    const totalBudget = budgets.reduce(
      (total, item) => total + item.budget,
      0
    );

    const totalSpent = budgets.reduce(
      (total, item) => total + item.spent,
      0
    );

    const remaining = totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      remaining,
    };
  }, [budgets]);

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getPercentage = (spent, budget) => {
    if (!budget) return 0;

    return Math.min((spent / budget) * 100, 100);
  };

  const getBudgetStatus = (spent, budget) => {
    if (spent > budget) {
      return "over";
    }

    if (spent / budget >= 0.8) {
      return "warning";
    }

    return "safe";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      category: "",
      budget: "",
      spent: "",
    });
  };

  const handleOpenAddForm = () => {
    resetForm();
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (budget) => {
    setEditingBudget(budget);

    setFormData({
      category: budget.category,
      budget: budget.budget.toString(),
      spent: budget.spent.toString(),
    });

    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
    resetForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const category = formData.category.trim();
    const budgetAmount = Number(formData.budget);
    const spentAmount = Number(formData.spent);

    if (!category || budgetAmount <= 0 || spentAmount < 0) {
      return;
    }

    const budgetData = {
      category,
      budget: budgetAmount,
      spent: spentAmount,
    };

    if (editingBudget) {
      setBudgets((previous) =>
        previous.map((item) =>
          item.id === editingBudget.id
            ? {
                ...item,
                ...budgetData,
              }
            : item
        )
      );
    } else {
      setBudgets((previous) => [
        {
          id: Date.now(),
          ...budgetData,
        },
        ...previous,
      ]);
    }

    handleCloseForm();
  };

  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
  };

  const handleCancelDelete = () => {
    setBudgetToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!budgetToDelete) return;

    setBudgets((previous) =>
      previous.filter((item) => item.id !== budgetToDelete.id)
    );

    setBudgetToDelete(null);
  };

  return (
    <div className="budgets-page">
      {/* Header */}
      <div className="budgets-header">
        <div>
          <h1>Budgets</h1>
          <p>
            Create and manage your monthly spending budgets.
          </p>
        </div>

        <button
          type="button"
          className="add-budget-button"
          onClick={handleOpenAddForm}
        >
          + Add Budget
        </button>
      </div>

      {/* Summary */}
      <div className="budget-summary-grid">
        <div className="budget-summary-card">
          <div className="budget-summary-icon budget-icon-blue">
            Rs
          </div>

          <div>
            <span>Total Budget</span>
            <h2>{formatCurrency(budgetSummary.totalBudget)}</h2>
          </div>
        </div>

        <div className="budget-summary-card">
          <div className="budget-summary-icon budget-icon-red">
            ↓
          </div>

          <div>
            <span>Total Spent</span>
            <h2>{formatCurrency(budgetSummary.totalSpent)}</h2>
          </div>
        </div>

        <div className="budget-summary-card">
          <div className="budget-summary-icon budget-icon-green">
            ✓
          </div>

          <div>
            <span>Remaining</span>
            <h2
              className={
                budgetSummary.remaining >= 0
                  ? "budget-positive"
                  : "budget-negative"
              }
            >
              {formatCurrency(budgetSummary.remaining)}
            </h2>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="budgets-grid">
        {budgets.length > 0 ? (
          budgets.map((item) => {
            const percentage = getPercentage(
              item.spent,
              item.budget
            );

            const status = getBudgetStatus(
              item.spent,
              item.budget
            );

            const remaining = item.budget - item.spent;

            return (
              <div className="budget-card" key={item.id}>
                <div className="budget-card-header">
                  <div>
                    <h2>{item.category}</h2>
                    <p>Monthly Budget</p>
                  </div>

                  <div className="budget-card-actions">
                    <button
                      type="button"
                      className="edit-budget-button"
                      onClick={() => handleOpenEditForm(item)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-budget-button"
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="budget-amount-row">
                  <div>
                    <span>Spent</span>
                    <strong>
                      {formatCurrency(item.spent)}
                    </strong>
                  </div>

                  <div className="budget-total">
                    <span>Budget</span>
                    <strong>
                      {formatCurrency(item.budget)}
                    </strong>
                  </div>
                </div>

                <div className="budget-progress-container">
                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-fill ${status}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>

                  <span className={`budget-percentage ${status}`}>
                    {Math.round(percentage)}%
                  </span>
                </div>

                <div className="budget-status-row">
                  <span>
                    {remaining >= 0
                      ? `${formatCurrency(remaining)} remaining`
                      : `${formatCurrency(
                          Math.abs(remaining)
                        )} over budget`}
                  </span>

                  <span className={`budget-status ${status}`}>
                    {status === "over"
                      ? "Over Budget"
                      : status === "warning"
                      ? "Near Limit"
                      : "On Track"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-budgets">
            <h2>No Budgets Yet</h2>
            <p>
              Create your first monthly budget to start tracking
              your spending.
            </p>

            <button
              type="button"
              className="add-budget-button"
              onClick={handleOpenAddForm}
            >
              + Create Budget
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="budget-modal-overlay">
          <div
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-modal-title"
          >
            <div className="budget-modal-header">
              <div>
                <h2 id="budget-modal-title">
                  {editingBudget
                    ? "Edit Budget"
                    : "Add Budget"}
                </h2>

                <p>
                  {editingBudget
                    ? "Update your budget details."
                    : "Create a monthly spending budget."}
                </p>
              </div>

              <button
                type="button"
                className="close-budget-modal-button"
                onClick={handleCloseForm}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form
              className="budget-form"
              onSubmit={handleSubmit}
            >
              <div className="budget-form-group">
                <label htmlFor="budget-category">
                  Category
                </label>

                <input
                  id="budget-category"
                  name="category"
                  type="text"
                  placeholder="e.g. Food"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="budget-form-row">
                <div className="budget-form-group">
                  <label htmlFor="budget-amount">
                    Budget Amount
                  </label>

                  <input
                    id="budget-amount"
                    name="budget"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 30000"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="budget-form-group">
                  <label htmlFor="budget-spent">
                    Amount Spent
                  </label>

                  <input
                    id="budget-spent"
                    name="spent"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 12000"
                    value={formData.spent}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="budget-form-actions">
                <button
                  type="button"
                  className="cancel-budget-button"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-budget-button"
                >
                  {editingBudget
                    ? "Update Budget"
                    : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {budgetToDelete && (
        <div className="budget-modal-overlay">
          <div
            className="delete-budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-budget-title"
          >
            <div className="delete-budget-icon">!</div>

            <h2 id="delete-budget-title">
              Delete Budget?
            </h2>

            <p>
              Are you sure you want to delete the{" "}
              <strong>{budgetToDelete.category}</strong> budget?
              This action cannot be undone.
            </p>

            <div className="delete-budget-actions">
              <button
                type="button"
                className="cancel-budget-button"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-budget-button"
                onClick={handleConfirmDelete}
              >
                Delete Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;