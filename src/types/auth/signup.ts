export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  company: string;
}

export interface ApiBaseResponse<TData = unknown> {
  data: TData | null;
  isSuccess: boolean;
  errors: string[];
  validationErrors: Record<string, string | string[]>;
  successes: string[];
}

export type SignupResponse = ApiBaseResponse<null>;
