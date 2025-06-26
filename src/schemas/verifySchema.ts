import z from 'zod';

export const verifySchema = z.object({
    code : z.string().min(6, { message: 'Verification code must be at least 6 characters long' }),
});