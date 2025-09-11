export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  data: null;
  isSuccess: boolean;
  errors: string[];
  validationErrors: Record<string, string | string[]>;
  successes: string[];
}
