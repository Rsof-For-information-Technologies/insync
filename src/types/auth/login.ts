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
  ProfilePicture: File | string | null;
  tenantId: string;
  role: string | null;
  roles: string[];
}

export type LoginResponse = ApiBaseResponse<LoginData>;
