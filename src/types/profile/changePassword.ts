export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  data: null;
  isSuccess: boolean;
  errors: string[];
  validationErrors: Record<string, string | string[]>;
  successes: string[];
}