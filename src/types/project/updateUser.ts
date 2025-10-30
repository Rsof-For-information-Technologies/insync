import { ApiBaseResponse } from "..";

export interface UpdateProjectRequest {
  id: string;
  description: string;
}
export type UpdateProjectResponse = ApiBaseResponse<null>
