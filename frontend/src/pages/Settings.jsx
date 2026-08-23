import { useState } from "react";
import "./Settings.css";
import { useTransactions } from "../context/TransactionContext";

function Settings() {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useTransactions();

  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingCategoryType, setEditingCategoryType] =
    useState("expense");

  const [categoryError, setCategoryError] = useState("");
  const [categorySuccess, setCategorySuccess] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  const handleCreateCategory = async (event) => {
    event.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required.");
      setCategorySuccess("");
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError("");
      setCategorySuccess("");

      await createCategory(trimmedName, categoryType);

      setCategoryName("");
      setCategoryType("expense");
      setCategorySuccess("Category created successfully.");
    } catch (error) {
      setCategoryError(
        error.message || "Failed to create category."
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
    setEditingCategoryType(category.type);

    setCategoryError("");
    setCategorySuccess("");
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setEditingCategoryType("expense");

    setCategoryError("");
  };

  const handleUpdateCategory = async (event, categoryId) => {
    event.preventDefault();

    const trimmedName = editingCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required.");
      setCategorySuccess("");
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError("");
      setCategorySuccess("");

      await updateCategory(
        categoryId,
        trimmedName,
        editingCategoryType
      );

      setEditingCategoryId(null);
      setEditingCategoryName("");
      setEditingCategoryType("expense");

      setCategorySuccess("Category updated successfully.");
    } catch (error) {
      setCategoryError(
        error.message || "Failed to update category."
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCategoryError("");
      setCategorySuccess("");

      await deleteCategory(categoryId);

      if (editingCategoryId === categoryId) {
        handleCancelEdit();
      }

      setCategorySuccess("Category deleted successfully.");
    } catch (error) {
      setCategoryError(
        error.message || "Failed to delete category."
      );
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences.</p>
      </div>

      <div className="settings-sections">
        {/* Profile */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Profile</h2>
            <p>Update your personal information.</p>
          </div>

          <div className="settings-form">
            <div className="settings-field">
              <label htmlFor="settings-name">Full Name</label>

              <input
                id="settings-name"
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="settings-email">Email</label>

              <input
                id="settings-email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="button"
              className="settings-primary-button"
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Preferences</h2>
            <p>
              Customize how your finance tracker works.
            </p>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <h3>Currency</h3>
                <p>
                  Select the currency used throughout the
                  application.
                </p>
              </div>

              <select defaultValue="PKR">
                <option value="PKR">
                  PKR - Pakistani Rupee
                </option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">
                  GBP - British Pound
                </option>
              </select>
            </div>

            <div className="settings-option">
              <div>
                <h3>Email Notifications</h3>
                <p>
                  Receive notifications about your finances.
                </p>
              </div>

              <label className="settings-switch">
                <input
                  type="checkbox"
                  defaultChecked
                />
                <span></span>
              </label>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Categories</h2>
            <p>
              Create and manage categories for your income
              and expenses.
            </p>
          </div>

          {/* Add Category */}
          <form
            className="category-form"
            onSubmit={handleCreateCategory}
          >
            <div className="settings-field">
              <label htmlFor="category-name">
                Category Name
              </label>

              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.target.value)
                }
                placeholder="e.g. Food, Salary, Transport"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="category-type">
                Category Type
              </label>

              <select
                id="category-type"
                value={categoryType}
                onChange={(event) =>
                  setCategoryType(event.target.value)
                }
              >
                <option value="expense">
                  Expense
                </option>

                <option value="income">
                  Income
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="settings-primary-button"
              disabled={categoryLoading}
            >
              {categoryLoading
                ? "Adding..."
                : "Add Category"}
            </button>
          </form>

          {/* Messages */}
          {categoryError && (
            <p className="category-message category-error">
              {categoryError}
            </p>
          )}

          {categorySuccess && (
            <p className="category-message category-success">
              {categorySuccess}
            </p>
          )}

          {/* Category List */}
          <div className="category-list">
            <h3>Your Categories</h3>

            {categories.length === 0 ? (
              <p className="category-empty">
                No categories created yet.
              </p>
            ) : (
              <div className="category-items">
                {categories.map((category) => {
                  const isEditing =
                    editingCategoryId === category._id;

                  if (isEditing) {
                    return (
                      <form
                        className="category-item category-item-editing"
                        key={category._id}
                        onSubmit={(event) =>
                          handleUpdateCategory(
                            event,
                            category._id
                          )
                        }
                      >
                        <div className="category-edit-fields">
                          <div className="settings-field">
                            <label
                              htmlFor={`edit-category-name-${category._id}`}
                            >
                              Category Name
                            </label>

                            <input
                              id={`edit-category-name-${category._id}`}
                              type="text"
                              value={editingCategoryName}
                              onChange={(event) =>
                                setEditingCategoryName(
                                  event.target.value
                                )
                              }
                              autoFocus
                            />
                          </div>

                          <div className="settings-field">
                            <label
                              htmlFor={`edit-category-type-${category._id}`}
                            >
                              Type
                            </label>

                            <select
                              id={`edit-category-type-${category._id}`}
                              value={editingCategoryType}
                              onChange={(event) =>
                                setEditingCategoryType(
                                  event.target.value
                                )
                              }
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

                        <div className="category-edit-actions">
                          <button
                            type="submit"
                            className="settings-primary-button"
                            disabled={categoryLoading}
                          >
                            {categoryLoading
                              ? "Saving..."
                              : "Save"}
                          </button>

                          <button
                            type="button"
                            className="settings-secondary-button"
                            onClick={handleCancelEdit}
                            disabled={categoryLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div
                      className="category-item"
                      key={category._id}
                    >
                      <div>
                        <strong>{category.name}</strong>

                        <span
                          className={`category-type ${category.type}`}
                        >
                          {category.type === "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </div>

                      <div className="category-actions">
                        <button
                          type="button"
                          className="settings-edit-button"
                          onClick={() =>
                            handleStartEdit(category)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="settings-danger-button"
                          onClick={() =>
                            handleDeleteCategory(
                              category._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Security */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Security</h2>
            <p>Manage your account security.</p>
          </div>

          <div className="security-row">
            <div>
              <h3>Password</h3>
              <p>Change your account password.</p>
            </div>

            <button
              type="button"
              className="settings-secondary-button"
            >
              Change Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;