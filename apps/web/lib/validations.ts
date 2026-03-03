import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Product validation schema
export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().optional(),
  description: z.string().optional(),
});

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
