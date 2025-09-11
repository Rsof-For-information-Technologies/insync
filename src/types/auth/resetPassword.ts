export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export interface ResetPasswordResponse {
  data: null;
  isSuccess: boolean;
  errors: string[];
  validationErrors: Record<string, string | string[]>;
  successes: string[];
}
