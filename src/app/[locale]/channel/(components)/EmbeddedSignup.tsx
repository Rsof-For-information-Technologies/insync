"use client";

import React, { useEffect } from "react";
import { registerChannel } from "@/apiCalls/channel/channelapi";
import type { CreateChannelRequest, CreateChannelResponse } from "@/types/channel/createChannel";

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

        const sdkResponse = document.getElementById("sdk-response");
        if (sdkResponse) {
          sdkResponse.textContent = JSON.stringify(response, null, 2);
        }

        (async () => {
          const code = response.authResponse?.code ?? "";
          if (!code) return;

          const payload: CreateChannelRequest = {
            organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            phoneNumberId: "string",
            wabaId: "string",
            businessId: "string",
            businessType: "string",
            wabaUserId: "string",
            expiresIn: String(response.authResponse?.expiresIn ?? ""),
            code,
            status: response.status,
            token: response.authResponse?.accessToken ?? "",
          };

          try {
            const apiRes: CreateChannelResponse = await registerChannel(payload);
            const apiResponse = document.getElementById("api-response");
            if (apiResponse) {
              apiResponse.textContent = JSON.stringify(apiRes, null, 2);
            }
          } catch (err: unknown) {
            const apiResponse = document.getElementById("api-response");
            const message = err instanceof Error ? err.message : "Request failed";
            if (apiResponse) {
              apiResponse.textContent = JSON.stringify({ error: message }, null, 2);
            }
          }
        })();
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        scope:
          "whatsapp_business_management, whatsapp_business_messaging",
        extras: { version: "v3" },
      }
    );
  };

  return (
    <div>
      <button
        onClick={handleSignup}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
      >
        Add Channel
      </button>

      <div className="mt-4">
        <p className="font-semibold">SDK Response:</p>
        <pre
          id="sdk-response"
          className="bg-gray-100 p-2 rounded text-sm overflow-x-auto"
        ></pre>
      </div>

      <div className="mt-4">
        <p className="font-semibold">API Response:</p>
        <pre
          id="api-response"
          className="bg-gray-100 p-2 rounded text-sm overflow-x-auto"
        ></pre>
      </div>
    </div>
  );
};

export default EmbeddedSignup;
