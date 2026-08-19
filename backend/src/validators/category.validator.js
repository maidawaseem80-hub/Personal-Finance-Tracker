import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be 'income' or 'expense'" }),
  }),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').trim().optional(),
  type: z.enum(['income', 'expense']).optional(),
});