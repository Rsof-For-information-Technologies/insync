import { ApiBaseResponse } from "..";

export interface CreateProjectRequest {
  name: string;
  description: string;
  tenantId: string;
  organizationId: string;
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

export type CreateProjectResponse = ApiBaseResponse<Project>;
