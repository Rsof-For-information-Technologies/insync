import { ApiBaseResponse } from "..";

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
  tenantId: string;
  roles: string[];
}

export type LoginResponse = ApiBaseResponse<LoginData>;
