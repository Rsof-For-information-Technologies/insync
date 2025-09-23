import { z } from 'zod';

export const createTenantValidator = z.object({
    name: z.string({ required_error: "Name is required." })
    .min(1, 'Name is required'),
    domain: z.string({ required_error: "Domain is required." })
    .min(1, 'Domain is required'),
  })

export type CreateTenantSchema = z.infer<typeof createTenantValidator>;
