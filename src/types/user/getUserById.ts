export type UserByIdResponse = {
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
  updatedAt: string;
  updatedBy: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string;
};
