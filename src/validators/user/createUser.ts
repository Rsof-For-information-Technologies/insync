import { z } from 'zod';

export const createUserValidator = z.object({

    tenantId: z.string({ required_error: "Tenant ID is required." })
    .min(1, 'Tenant ID is required'),
  organizationId: z.string({ required_error: "Organization ID is required." })
    .min(1, 'Organization ID is required'),
  userId: z.string({ required_error: "User ID is required." })
    .min(1, 'User ID is required'),
  email: z.string({ required_error: "Email is required." })
    .min(1, 'Email is required'),
});

export type CreateUserSchema = z.infer<typeof createUserValidator>;
