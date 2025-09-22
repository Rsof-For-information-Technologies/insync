import { z } from 'zod';

export const updateOrganizationValidator = z.object({
    name: z.string().optional(),
    id: z.string().min(1, 'ID is required.'),
    phone: z.string({ required_error: "Phone is required." })
    .min(1, 'Phone is required'),
    industryType: z.string({ required_error: "Industry Type is required." })
    .min(1, 'Industry Type is required'),
    email: z.string({ required_error: "Email is required." })
    .min(1, 'Email is required'),
    country: z.string({ required_error: "Country is required." })
    .min(1, 'Country is required'),
  })

export type UpdateOrganizationSchema = z.infer<typeof updateOrganizationValidator>;
