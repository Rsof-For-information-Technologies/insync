import { z } from 'zod';

export const changePasswordValidator = z
  .object({
    userId: z.string().min(1, 'User ID is required'),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must not exceed 32 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
  })

export type ChangePasswordSchema = z.infer<typeof changePasswordValidator>;
