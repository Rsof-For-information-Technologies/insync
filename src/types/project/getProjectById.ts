import { ApiBaseResponse } from "..";

export interface GetProjectByIdRequest {
  id: string;
}

export interface Project {
  name: string;
  description: string;
  organizationId: string;
  isActive: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
}

export type GetProjectByIdResponse = ApiBaseResponse<Project>;
