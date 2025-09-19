"use client";
import React, { useEffect, useState } from "react";
import { registerChannel } from "@/apiCalls/channel/channelapi";
import type { SessionInfoResponse, SdkResponse, CreateChannelRequest, CreateChannelResponse } from "@/types/channel/createChannel";

const EmbeddedSignup: React.FC = () => {
  const [sessionData, setSessionData] = useState<SessionInfoResponse | null>(null);
  const [sdkResponse, setSdkResponse] = useState<SdkResponse | null>(null);

  // Handle session info messages from Meta
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) return;

      try {
        const data: SessionInfoResponse = JSON.parse(event.data);
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          setSessionData(data);
          if (data.event === "FINISH") {
            console.log(
              "Phone number ID:", data.data.phone_number_id,
              "WABA ID:", data.data.waba_id,
              "Business ID:", data.data.business_id
            );
          } else if (data.event === "CANCEL") {
            console.warn("Cancel at", data.data.current_step);
          } else if (data.event === "ERROR") {
            console.error("Error", data.data.error_message);
          }
        }
      } catch {
        console.log("Non JSON response", event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Facebook SDK init
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v23.0",
      });
    };

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Callback from FB login
  const fbLoginCallback = (response: SdkResponse) => {
    if (response.authResponse) {
      setSdkResponse(response);
      console.log("Returned code:", response.authResponse.code);
    }
  };

  async function handleSignup() {
    window.FB.login(fbLoginCallback, {
      config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID as string,
      response_type: "code",
      override_default_response_type: true,
      extras: { version: "v3" },
    });

    if (!sessionData || !sdkResponse) {
      console.warn("Session data or SDK response not ready yet");
      return;
    }
    const payload: CreateChannelRequest = {
      organizationID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      tenantID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      phoneNumberId: sessionData.data.phone_number_id || "",
      wabaId: sessionData.data.waba_id || "",
      businessId: sessionData.data.business_id || "",
      businessType: sessionData.type,
      wabaUserId: sdkResponse.authResponse.userID || "",
      expiresIn: sdkResponse.authResponse.expiresIn.toString() || "",
      code: sdkResponse.authResponse.code || "",
      status: sdkResponse.status || "",
      token: sdkResponse.authResponse?.accessToken || "",
    };
    console.log("Payload ready to send:", payload);
    try {
      const apiRes: CreateChannelResponse = await registerChannel(payload);
      console.log("API response:", apiRes);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Request failed";
      console.error("API error:", message);
    }
  }

  return (
    <div>
      <button
        onClick={handleSignup}
        className="px-[20px] py-[10px] bg-black text-white rounded-lg font-semibold"
      >
        Add Channel
      </button>
    </div>
  );
};

export default EmbeddedSignup;
