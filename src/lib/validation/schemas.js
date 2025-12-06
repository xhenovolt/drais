/**
 * Zod Validation Schemas
 */

import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'staff']).default('school_admin'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createSchoolSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters'),
  code: z.string().min(2, 'School code must be at least 2 characters'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  owner_name: z.string().min(2, 'Owner name required'),
  owner_email: z.string().email('Invalid owner email'),
  owner_phone: z.string().optional(),
  subscription_type: z.enum(['professional', 'premium', 'gold']).default('professional'),
  subscription_status: z.enum(['trial', 'active', 'suspended', 'cancelled']).default('trial'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  phone: z.string().optional(),
  role: z.enum(['super_admin', 'school_admin', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'staff']),
  school_id: z.number().optional(),
  is_active: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  is_active: z.boolean().optional(),
});
