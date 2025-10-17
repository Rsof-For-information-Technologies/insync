import { ApiBaseResponse } from ".";
import { LoginData } from "./auth/login";

export type User = LoginData

export interface GetUserById {
    succeeded: boolean;
    message: string | null;
    validationResultModel: any | null;
    data: User;
}

export type GetUsers = ApiBaseResponse<User[]>

export interface UpdateUserRequest {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export type UpdateUserResponse = ApiBaseResponse<User>

