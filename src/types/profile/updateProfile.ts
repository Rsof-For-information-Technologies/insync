import { ApiBaseResponse } from "..";

export interface UpdateProfileRequest {
  UserId: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  ProfilePicture: File | string | null;
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

export type UpdateProfileResponse = ApiBaseResponse<User>;
