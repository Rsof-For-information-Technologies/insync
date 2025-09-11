import { z } from "zod";

export const resetPasswordValidator = z.object({
    newPassword: z.string({ required_error: "New Password is required." })
        .min(1, { message: "New Password is required." })
        .min(6, "Password must be at least 6 characters long.")
        .max(50, "Password must not exceed 50 characters."),
    confirmPassword: z.string({ required_error: "Confirmed Password is required." })
        .min(1, { message: "Confirmed Password is required." })
        .min(6, "New Password must be at least 6 characters long.")
        .max(50, "Password must not exceed 50 characters.")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
})

export type ResetPassword = z.infer<typeof resetPasswordValidator>

