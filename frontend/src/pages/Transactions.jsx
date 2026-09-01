import { useMemo, useState } from "react";
import "./Transactions.css";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";

function Transactions() {
  const {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    transactionSummary,
  } = useTransactions();

  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
  });

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =========================================================
  // Currency
  // =========================================================

  const currency = user?.preferences?.currency || "PKR";

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount || 0);

    if (currency === "USD") {
      return `$${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    if (currency === "EUR") {
      return `${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} €`;
    }

    if (currency === "GBP") {
      return `£${numericAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    return `Rs. ${numericAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // =========================================================
  // Filter Transactions
  // =========================================================

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return transactions.filter((transaction) => {
      const categoryName =
        typeof transaction.category === "object"
          ? transaction.category?.name || ""
          : transaction.category || "";

      const description =
        transaction.description ||
        transaction.note ||
        "";

      const matchesSearch =
        description.toLowerCase().includes(search) ||
        categoryName.toLowerCase().includes(search);

      const matchesType =
        filterType === "all" ||
        transaction.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  // =========================================================
  // Form Input
  // =========================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  // =========================================================
  // Reset Form
  // =========================================================

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      type: "expense",
      category: "",
      date: "",
    });

    setFormError("");
  };

  // =========================================================
  // Open Add Form
  // =========================================================

  const handleOpenAddForm = () => {
    resetForm();
    setEditingTransaction(null);
    setShowForm(true);
  };

  // =========================================================
  // Open Edit Form
  // =========================================================

  const handleOpenEditForm = (transaction) => {
    setEditingTransaction(transaction);

    const categoryId =
      typeof transaction.category === "object"
        ? transaction.category?._id || ""
        : transaction.category || "";

    setFormData({
      description:
        transaction.description ||
        transaction.note ||
        "",

      amount:
        transaction.amount?.toString() || "",

      type: transaction.type,

      category: categoryId,

      date: transaction.date
        ? new Date(transaction.date)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setFormError("");
    setShowForm(true);
  };

  // =========================================================
  // Close Form
  // =========================================================

  const handleCloseForm = () => {
    if (formLoading) {
      return;
    }

    setShowForm(false);
    setEditingTransaction(null);
    resetForm();
  };

  // =========================================================
  // Submit Transaction
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const description =
      formData.description.trim();

    const category = formData.category;
    const amount = Number(formData.amount);

    if (!description) {
      setFormError("Description is required.");
      return;
    }

    if (!category) {
      setFormError("Please select a category.");
      return;
    }

    if (!formData.date) {
      setFormError("Please select a date.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    const transactionData = {
      description,
      amount,
      type: formData.type,
      category,
      date: formData.date,
    };

    try {
      setFormLoading(true);
      setFormError("");

      if (editingTransaction) {
        await updateTransaction(
          editingTransaction._id ||
            editingTransaction.id,
          transactionData
        );
      } else {
        await addTransaction(transactionData);
      }

      setShowForm(false);
      setEditingTransaction(null);
      resetForm();
    } catch (error) {
      console.error(
        "Failed to save transaction:",
        error
      );

      setFormError(
        error.message ||
          "Failed to save transaction."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // =========================================================
  // Delete
  // =========================================================

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleCancelDelete = () => {
    if (deleteLoading) {
      return;
    }

    setTransactionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteTransaction(
        transactionToDelete._id ||
          transactionToDelete.id
      );

      setTransactionToDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete transaction:",
        error
      );

      alert(
        error.message ||
          "Failed to delete transaction."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================================
  // Format Date
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // Category Name
  // =========================================================

  const getCategoryName = (category) => {
    if (typeof category === "object") {
      return category?.name || "Unknown";
    }

    const foundCategory =
      categories.find(
        (item) => item._id === category
      );

    return (
      foundCategory?.name ||
      category ||
      "Unknown"
    );
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="transactions-page">

      {/* Page Header */}

      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>

          <p>
            View and manage your financial
            transactions.
          </p>
        </div>

        <button
          className="add-transaction-button"
          type="button"
          onClick={handleOpenAddForm}
        >
          + Add Transaction
        </button>
      </div>

      {/* Transaction Summary */}

      <div className="transaction-summary-grid">

        {/* Income */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon income-icon">
            ↑
          </div>

          <div className="transaction-summary-content">
            <span>Total Income</span>

            <h2>
              {formatCurrency(
                transactionSummary.totalIncome
              )}
            </h2>
          </div>
        </div>

        {/* Expenses */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon expense-icon">
            ↓
          </div>

          <div className="transaction-summary-content">
            <span>Total Expenses</span>

            <h2>
              {formatCurrency(
                transactionSummary.totalExpenses
              )}
            </h2>
          </div>
        </div>

        {/* Balance */}

        <div className="transaction-summary-card">
          <div className="transaction-summary-icon balance-icon">
            {currency}
          </div>

          <div className="transaction-summary-content">
            <span>Current Balance</span>

            <h2
              className={
                transactionSummary.currentBalance >= 0
                  ? "balance-positive"
                  : "balance-negative"
              }
            >
              {formatCurrency(
                transactionSummary.currentBalance
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}

      {showForm && (
        <div className="transaction-modal-overlay">

          <div
            className="transaction-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
          >

            {/* Modal Header */}

            <div className="transaction-modal-header">

              <div>
                <h2 id="transaction-modal-title">
                  {editingTransaction
                    ? "Edit Transaction"
                    : "Add Transaction"}
                </h2>

                <p>
                  {editingTransaction
                    ? "Update the transaction details."
                    : "Enter the details of your transaction."}
                </p>
              </div>

              <button
                type="button"
                className="close-modal-button"
                onClick={handleCloseForm}
                disabled={formLoading}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="transaction-form"
            >

              {/* Description */}

              <div className="transaction-form-group">
                <label htmlFor="description">
                  Description
                </label>

                <input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="e.g. Grocery shopping"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={formLoading}
                  required
                />
              </div>

              {/* Amount + Type */}

              <div className="transaction-form-row">

                <div className="transaction-form-group">
                  <label htmlFor="amount">
                    Amount
                  </label>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 2500"
                    value={formData.amount}
                    onChange={handleInputChange}
                    disabled={formLoading}
                    required
                  />
                </div>

                <div className="transaction-form-group">
                  <label htmlFor="type">
                    Type
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={formLoading}
                  >
                    <option value="expense">
                      Expense
                    </option>

                    <option value="income">
                      Income
                    </option>
                  </select>
                </div>

              </div>

              {/* Category + Date */}

              <div className="transaction-form-row">

                <div className="transaction-form-group">
                  <label htmlFor="category">
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={formLoading}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories
                      .filter(
                        (category) =>
                          category.type ===
                          formData.type
                      )
                      .map((category) => (
                        <option
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="transaction-form-group">
                  <label htmlFor="date">
                    Date
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={formLoading}
                    required
                  />
                </div>

              </div>

              {/* Error */}

              {formError && (
                <p className="category-message category-error">
                  {formError}
                </p>
              )}

              {/* Actions */}

              <div className="transaction-form-actions">

                <button
                  type="button"
                  className="cancel-transaction-button"
                  onClick={handleCloseForm}
                  disabled={formLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-transaction-button"
                  disabled={formLoading}
                >
                  {formLoading
                    ? editingTransaction
                      ? "Updating..."
                      : "Saving..."
                    : editingTransaction
                    ? "Update Transaction"
                    : "Save Transaction"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}

      {transactionToDelete && (
        <div className="transaction-modal-overlay">

          <div
            className="delete-confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirmation-title"
          >

            <div className="delete-confirmation-icon">
              !
            </div>

            <h2 id="delete-confirmation-title">
              Delete Transaction?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {transactionToDelete.description ||
                  transactionToDelete.note}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="delete-confirmation-actions">

              <button
                type="button"
                className="cancel-transaction-button"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Transaction"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Transactions Content */}

      <div className="transactions-content">

        {/* Filters */}

        <div className="transactions-filters">

          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          <select
            value={filterType}
            onChange={(event) =>
              setFilterType(event.target.value)
            }
          >
            <option value="all">
              All Transactions
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expenses
            </option>
          </select>

        </div>

        {/* Table */}

        <div className="transactions-table-container">

          <table className="transactions-table">

            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(
                  (transaction) => (
                    <tr
                      key={
                        transaction._id ||
                        transaction.id
                      }
                    >

                      <td>
                        {transaction.description ||
                          transaction.note}
                      </td>

                      <td>
                        {getCategoryName(
                          transaction.category
                        )}
                      </td>

                      <td>
                        {formatDate(
                          transaction.date
                        )}
                      </td>

                      <td>
                        <span
                          className={`transaction-type ${transaction.type}`}
                        >
                          {transaction.type ===
                          "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </td>

                      <td
                        className={`transaction-amount ${transaction.type}`}
                      >
                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}{" "}
                        {formatCurrency(
                          transaction.amount
                        )}
                      </td>

                      <td>
                        <div className="transaction-actions">

                          <button
                            type="button"
                            className="edit-transaction-button"
                            onClick={() =>
                              handleOpenEditForm(
                                transaction
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-transaction-button"
                            onClick={() =>
                              handleDeleteClick(
                                transaction
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="no-transactions"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
