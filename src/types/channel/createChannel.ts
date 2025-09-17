export interface CreateChannelRequest {
  organizationID: string;
  tenantID: string;
  phoneNumberId: string;
  wabaId: string;
  businessId: string;
  businessType: string;
  wabaUserId: string;
  expiresIn: string;
  code: string;
  status: string;
  token: string;
}

export interface ChannelData {
  organizationID: string;
  tenantID: string;
  phoneNumberId: string;
  wabaId: string;
  businessId: string;
  businessType: string;
  wabaUserId: string;
  expiresIn: string;
  code: string;
  status: string;
  token: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string;
  id: string;
}

// Wrapper response for create channel API
export interface CreateChannelResponse {
  succeeded: boolean;
  message: string;
  data: ChannelData;
}
