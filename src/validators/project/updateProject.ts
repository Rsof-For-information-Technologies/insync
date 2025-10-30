import { z } from 'zod';

export const updateProjectValidator = z.object({
    name: z.string().optional(),
    id: z.string().min(1, 'ID is required.'),
    description: z.string({ required_error: "Description is required." })
    .min(1, 'Description is required'),
  })

export type UpdateProjectSchema = z.infer<typeof updateProjectValidator>;
