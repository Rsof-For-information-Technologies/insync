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

export interface CreateChannelResponse {
  succeeded: boolean;
  message: string;
  data: ChannelData;
}

export interface SdkResponse {
  authResponse: {
    code: string;
    userID: string | null;
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
  };
  status: string;
}

export interface SessionInfoResponse {
  data: {
    phone_number_id: string;
    waba_id: string;
    business_id: string;
    current_step?: string;
    error_message?: string;
  };
  type: string;
  event: "FINISH" | "CANCEL" | "ERROR";
  version: string;
}


declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (config: {
        appId: string;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: SdkResponse) => void,
        options?: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          extras: Record<string, unknown>;
        }
      ) => void;
    };
  }
}