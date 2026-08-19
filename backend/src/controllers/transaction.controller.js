import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
  const { amount, type, category, note, date } = req.body;

  // Verify the category exists and belongs to this user
  const categoryExists = await Category.findOne({ _id: category, user: req.user._id });
  if (!categoryExists) {
    res.status(404);
    throw new Error('Category not found');
  }

  const transaction = await Transaction.create({
    amount,
    type,
    category,
    note,
    date,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: transaction });
});

// @desc    Get all transactions for logged-in user (with filtering, sorting, pagination)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, sortBy = 'date', order = 'desc', page = 1, limit = 20 } = req.query;

  const query = { user: req.user._id };

  if (type) query.type = type;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('category', 'name type')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: transactions,
  });
});

// @desc    Get a single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('category', 'name type');

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  res.status(200).json({ success: true, data: transaction });
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // If category is being changed, verify the new one belongs to this user
  if (req.body.category) {
    const categoryExists = await Category.findOne({ _id: req.body.category, user: req.user._id });
    if (!categoryExists) {
      res.status(404);
      throw new Error('Category not found');
    }
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name type');

  res.status(200).json({ success: true, data: transaction });
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  await transaction.deleteOne();

  res.status(200).json({ success: true, message: 'Transaction deleted', data: {} });
});