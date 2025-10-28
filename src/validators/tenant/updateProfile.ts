import { z } from 'zod';

export const updateProfileValidator = z.object({
    FirstName: z.string({ required_error: "First name is required." })
        .min(1, "First name is required."),
    LastName: z.string({ required_error: "Last name is required." })
        .min(1, "Last name is required."),
    PhoneNumber: z.string({ required_error: "Phone number is required." })
        .min(1, "Phone number is required."),
    ProfilePicture: z.custom<File|null>().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileValidator>