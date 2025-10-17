import { ApiBaseResponse } from "..";

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordResponse = ApiBaseResponse<null>;