export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  userId: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
  tenandId: string;
  roles: string[];
}

export interface LoginResponseBase<TData = unknown> {
  data: TData;
  isSuccess: boolean;
  errors: string[];
  validationErrors: Record<string, string | string[]>;
  successes: string[];
}

export type LoginResponse = LoginResponseBase<LoginData>;
