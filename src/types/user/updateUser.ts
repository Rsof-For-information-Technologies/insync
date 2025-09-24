export interface UpdateUserRequest {
  id: string;
  isActive: boolean;
  isInvitationSent: boolean;
  isInvitationAccept: boolean;
}

export interface UpdateUserResponse {
  succeeded: boolean;
  message: string;
  data: {
    existEntity: {
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
  };
}
