import { z } from 'zod';

export const signupValidator = z.object({
    FirstName: z.string({ required_error: "First name is required." })
        .min(1, "First name is required."),
    LastName: z.string({ required_error: "Last name is required." })
        .min(1, "Last name is required."),
    Email: z.string({ required_error: "Email is required." })
        .min(1, "Email is required."),
    Password: z.string({ required_error: "Password is required." })
        .min(1, "Password is required."),
    ConfirmPassword: z.string({ required_error: "Confirm password is required." })
        .min(1, "Confirm password is required."),
    Company: z.string({ required_error: "Company is required." })
        .min(1, "Company is required."),
    PhoneNumber: z.string({ required_error: "Phone number is required." })
        .min(1, "Phone number is required."),
    ProfilePicture: z.custom<File|null>().optional(),
}).refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords do not match.",
    path: ["ConfirmPassword"],
});

export type SignupSchema = z.infer<typeof signupValidator>