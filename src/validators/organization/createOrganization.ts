import { z } from 'zod';

export const createOrganizationValidator = z.object({
    name: z.string({ required_error: "Name is required." })
    .min(1, 'Name is required'),
    phone: z.string({ required_error: "Phone is required." })
    .min(1, 'Phone is required'),
    industryType: z.string({ required_error: "Industry Type is required." })
    .min(1, 'Industry Type is required'),
    email: z.string({ required_error: "Email is required." })
    .min(1, 'Email is required'),
    country: z.string({ required_error: "Country is required." })
    .min(1, 'Country is required'),
    tenantId: z.string({ required_error: "Tenant ID is required." })
    .min(1, 'Tenant ID is required'),
  })

export type CreateOrganizationSchema = z.infer<typeof createOrganizationValidator>;
