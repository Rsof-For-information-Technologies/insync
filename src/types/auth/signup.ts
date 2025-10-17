import { ApiBaseResponse } from "..";

export interface SignupRequest {
  Email: string;
  Password: string;
  ConfirmPassword: string;
  FirstName: string;
  LastName: string;
  Company: string;
  PhoneNumber: string;
  ProfilePicture: File | string | null;
}

export type SignupResponse = ApiBaseResponse<null>;
