import z from 'zod';

export const usernameValidation = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(20, { message: 'Username must be at most 20 characters long' })
  .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' });

export const signUpSchema = z
  .object({
    username: usernameValidation,
    email: z.string().email({ message: 'Email is invalid' }),
    password: z.string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(50, { message: 'Password must be at most 100 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }),
  });

export const emailValidation = z
  .string()
  .min(5, { message: 'Email must be at least 5 characters long' })
  .max(100, { message: 'Email must be at most 100 characters long' })
  .email({ message: 'Email is invalid' });

export const passwordValidation = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .max(100, { message: 'Password must be at most 100 characters long' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });