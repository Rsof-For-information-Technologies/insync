import { ApiBaseResponse } from "..";

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export type ResetPasswordResponse = ApiBaseResponse<null>;

