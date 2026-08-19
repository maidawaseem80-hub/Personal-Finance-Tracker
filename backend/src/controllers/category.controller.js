import Category from '../models/category.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;

  const category = await Category.create({
    name,
    type,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: category });
});

// @desc    Get all categories for logged-in user
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: categories.length, data: categories });
});

// @desc    Get a single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({ success: true, data: category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findOne({ _id: req.params.id, user: req.user._id });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: category });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();

  res.status(200).json({ success: true, message: 'Category deleted', data: {} });
});