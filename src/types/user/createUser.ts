export interface CreateUserRequest {
  tenantId: string;
  organizationId: string;
  userId: string;
  email: string;
}

export interface CreateUserResponse {
  succeeded: boolean;
  message: string;
  data: {
    id: string;
    tenantId: string;
    organizationId: string;
    userId: string;
    email: string;
    isActive: boolean;
    isInvitationSent: boolean;
    isInvitationAccept: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string | null;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string;
  };
}
