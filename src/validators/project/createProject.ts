import { z } from 'zod';

export const createProjectValidator = z.object({
  name: z.string({ required_error: "Project name is required." })
    .min(2, 'Project name must be at least 2 characters long.'),
  description: z.string({ required_error: "Project description is required." })
    .min(5, 'Project description must be at least 5 characters long.'),
  tenantId: z.string({ required_error: "Tenant ID is required." })
    .min(1, 'Tenant ID is required'),
  organizationId: z.string({ required_error: "Organization ID is required." })
    .min(1, 'Organization ID is required'),
});

export type CreateProjectSchema = z.infer<typeof createProjectValidator>;
