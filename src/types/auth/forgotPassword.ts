import { ApiBaseResponse } from "..";

export interface ForgotPasswordRequest {
  email: string;
}

export type ForgotPasswordResponse = ApiBaseResponse<null>

