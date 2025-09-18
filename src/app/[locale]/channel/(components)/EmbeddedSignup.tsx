"use client";
import React, { useEffect } from "react";
import { registerChannel } from "@/apiCalls/channel/channelapi";
import type { CreateChannelRequest, CreateChannelResponse, SessionInfoResponse, SdkResponse } from "@/types/channel/createChannel";
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginStatus) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          scope: string;
          extras: Record<string, string>;
        }
      ) => void;
    };
  }
}

interface FacebookAuthResponse {
  accessToken?: string;
  expiresIn?: number;
  signedRequest?: string;
  userID?: string;
  code?: string; // this is important when using response_type: 'code'
}

interface FacebookLoginStatus {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
}

interface EmbeddedSignupProps {
  appId: string;
  configId: string;
}

const EmbeddedSignup: React.FC<EmbeddedSignupProps> = ({ appId, configId }) => {
  useEffect(() => {
    // Dynamically load the Facebook SDK script
    (function (d, s, id) {
      const element = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;

      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      element.parentNode?.insertBefore(js, element);
    })(document, "script", "facebook-jssdk");

    // Initialize Facebook SDK
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: false,
        version: "v23.0",
      });
    };
  }, [appId]);

  const handleSignup = () => {
    window.FB.login(
      (response: FacebookLoginStatus) => {
        console.log("FB login response:", response);
        (async () => {
          const code = response.authResponse?.code ?? "";
          if (!code) return;
          const sdkResponse = response as unknown as SdkResponse;
          const sessionInfoRes = await fetch(`/api/get-session-info?code=${code}`);
          const sessionInfo: SessionInfoResponse = await sessionInfoRes.json();
          const payload: CreateChannelRequest = {
            organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            phoneNumberId: sessionInfo.data.phone_number_id,
            wabaId: sessionInfo.data.waba_id,
            businessId: sessionInfo.data.business_id,
            businessType: sessionInfo.type,
            wabaUserId: sdkResponse.authResponse.userID ?? "",
            expiresIn: String(sdkResponse.authResponse.expiresIn ?? ""),
            code: sdkResponse.authResponse.code,
            status: sdkResponse.status,
            token: sdkResponse.authResponse.accessToken ?? ""
          };
          try {
            const apiRes: CreateChannelResponse = await registerChannel(payload);
            console.log("API response:", apiRes);
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Request failed";
            console.error("API error:", message);
          }
        })();
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        scope: "whatsapp_business_management, whatsapp_business_messaging",
        extras: { version: "v3" }
      }
    );
  };

  return (
    <div>
      <button
        onClick={handleSignup}
        className="px-[20px] py-[10px] bg-black text-white rounded-lg  font-semibold"
      >
        Add Channel
      </button>
    </div>
  );
};

export default EmbeddedSignup;
