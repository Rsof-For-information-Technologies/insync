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
export interface SessionInfoResponse {
  data: {
    phone_number_id: string;
    waba_id: string;
    business_id: string;
  };
  type: string;
  event: string;
  version: string;
}
export interface SdkResponse {
  authResponse: {
    userID: string | null;
    expiresIn: number | null;
    code: string;
    accessToken?: string;
  };
  status: string;
}

