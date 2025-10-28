import { ApiBaseResponse } from "..";

export interface GetProfileRequest {
  userId: string;
}

export interface User {
  id: string;
  tenantId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}

export type GetProfileResponse = ApiBaseResponse<User>;
