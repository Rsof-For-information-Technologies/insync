"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Input, Select, Textarea } from "rizzui";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadCn/ui/tabs";
import { z } from "zod";


interface KeyValuePair {
  key: string;
  value: string;
}

interface NodeModalSavePayload {
  apiConfig: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  contentType: string;
  headers: KeyValuePair[];
  pathParams: KeyValuePair[];
  queryParams: KeyValuePair[];
  requestParams: KeyValuePair[];
  RequestBodyJsonText: string;
}

interface ApinodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: NodeModalSavePayload) => void;
  existingData?: NodeModalSavePayload; // 👈 add this line
}


const apiSchema = z.object({
  apiConfig: z.string()
    .nonempty("API endpoint is required")
    .url("Must be a valid URL (e.g. https://example.com/api)"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  contentType: z.string().nonempty("Content type is required"),
  headers: z.array(z.object({ key: z.string().nonempty("Header key required"), value: z.string().nonempty("Header value required") })),
  pathParams: z.array(z.object({ key: z.string().nonempty("Path key required"), value: z.string().nonempty("Path value required") })),
  queryParams: z.array(z.object({ key: z.string().nonempty("Query key required"), value: z.string().nonempty("Query value required") })),
  requestParams: z.array(z.object({ key: z.string().nonempty("Request key required"), value: z.string().nonempty("Request value required") })),
  RequestBodyJsonText: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Invalid JSON format"),
});

const validationSchema = apiSchema;

export default function ApinodeModal({
  isOpen,
  onClose,
  onSave,
  existingData,
}: ApinodeModalProps) {
  const t = useTranslations("Chatbot");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [pathParams, setPathParams] = useState<{ key: string; value: string }[]>([]);
  const [requestParams, setRequestParams] = useState<{ key: string; value: string }[]>([]);
  const [showJson, setShowJson] = useState(false);
  const [RequestBodyJsonText, setRequestBodyJsonText] = useState("");
  const addPathParam = () => setPathParams([...pathParams, { key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([]);
  const [apiConfig, setApiConfig] = useState("");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "">("");
  const [contentType, setContentType] = useState<string>("");

  useEffect(() => {
    if (isOpen && existingData) {
      setApiConfig(existingData.apiConfig || "");
      setMethod(existingData.method || "");
      setContentType(existingData.contentType || "");
      setHeaders(existingData.headers || []);
      setPathParams(existingData.pathParams || []);
      setQueryParams(existingData.queryParams || []);
      setRequestParams(existingData.requestParams || []);
      setRequestBodyJsonText(existingData.RequestBodyJsonText || "");
    }
  }, [isOpen, existingData]);



  // Path Params
  const removePathParam = (index: number) =>
    setPathParams(pathParams.filter((_, i) => i !== index));
  const updatePathParam = (index: number, field: "key" | "value", value: string) => {
    const updated = [...pathParams];
    updated[index][field] = value;
    setPathParams(updated);
  };

  // Query Params
  const addQueryParam = () => setQueryParams([...queryParams, { key: "", value: "" }]);
  const removeQueryParam = (index: number) =>
    setQueryParams(queryParams.filter((_, i) => i !== index));
  const updateQueryParam = (index: number, field: "key" | "value", value: string) => {
    const updated = [...queryParams];
    updated[index][field] = value;
    setQueryParams(updated);
  };

  // Headers
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  // Params / JSON

  const addParam = () => setRequestParams([...requestParams, { key: "", value: "" }]);
  const removeParam = (index: number) => setRequestParams(requestParams.filter((_, i) => i !== index));
  const updateParam = (index: number, field: "key" | "value", value: string) => {
    const updated = [...requestParams];
    updated[index][field] = value;
    setRequestParams(updated);
  };


  const testApi = async () => {
    if (!apiConfig) {
      toast.error("Please enter an API endpoint first");
      return;
    }

    try {
      let url = apiConfig;
      if (pathParams.length > 0) {
        pathParams.forEach(({ key, value }) => {
          url = url.replace(`{${key}}`, value);
        });
      }
      if (queryParams.length > 0) {
        const queryString = queryParams
          .filter((p) => p.key)
          .map(
            (p) =>
              `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
          )
          .join("&");
        url += (url.includes("?") ? "&" : "?") + queryString;
      }

      // Build headers
      const headerObj: Record<string, string> = {};
      headers.forEach(({ key, value }) => {
        if (key) headerObj[key] = value;
      });
      headerObj["Content-Type"] = contentType;

      // Build body
      let body: string | undefined;
      if (method !== "GET" && method !== "DELETE") {
        if (showJson && RequestBodyJsonText.trim()) {
          try {
            body = JSON.stringify(JSON.parse(RequestBodyJsonText));
          } catch {
            toast.error("Invalid JSON format");
            return;
          }
        } else if (requestParams.length > 0) {
          const bodyObj = requestParams.reduce(
            (acc, { key, value }) => {
              if (key) acc[key] = value;
              return acc;
            },
            {} as Record<string, string>
          );
          body = JSON.stringify(bodyObj);
        }
      }

      // Make the API request
      const response = await fetch(url, {
        method,
        headers: headerObj,
        body,
      });

      const contentTypeHeader = response.headers.get("content-type");
      let resultText: unknown;

      if (contentTypeHeader && contentTypeHeader.includes("application/json")) {
        resultText = await response.json();
      } else {
        resultText = await response.text();
      }

      if (!response.ok) {
        toast.error(`Error: ${response.status} ${response.statusText}`);
        console.error(resultText);
      } else {
        toast.success("API test successful!");
        console.log("Response:", resultText);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Request failed: ${error.message}`);
        console.error(error);
      } else {
        toast.error("Request failed. Unknown error.");
        console.error(error);
      }
    }
  };

  const handleSaveClick = () => {
    setIsSaveDisabled(true);

    try {
      validationSchema.parse({
        apiConfig,
        method,
        contentType,
        headers,
        pathParams,
        queryParams,
        requestParams,
        RequestBodyJsonText,
      });

      toast.success("API configuration saved!");
      onSave({ apiConfig, method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH", contentType, headers, pathParams, queryParams, requestParams, RequestBodyJsonText });

      // re-enable after success
      setTimeout(() => setIsSaveDisabled(false), 1000);
    } catch (error) {
      // validation failed → keep disabled
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]?.message;
        toast.error(firstError || "Validation failed");
      } else {
        toast.error("Unknown error during validation");
      }
      // keep it disabled, don’t re-enable
    }
  };

  useEffect(() => {
    if (isSaveDisabled) {
      setIsSaveDisabled(false);
    }
  }, [apiConfig, method, contentType, headers, pathParams, queryParams, requestParams, RequestBodyJsonText]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-[90]" />
      <div className="fixed top-0 right-0 h-full w-[30rem] bg-white shadow-2xl z-[100] flex flex-col animate-slide-left overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Connect API</h2>
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 hover:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* API Config */}
        <div className="p-5 space-y-5">
          <label className="block text-sm font-medium text-gray-700">API Configuration (required)</label>
          <Input
            placeholder="Enter your API endpoint (https://api.example.com/endpoint/{id})"
            value={apiConfig}
            onChange={(e) => setApiConfig(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Method */}
        <div className="p-5 space-y-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Methods</label>
          <Select
            value={method || undefined}
            onChange={(option: { label: string; value: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" }) =>
              setMethod(option.value)
            }
            options={[
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
              { label: "PUT", value: "PUT" },
              { label: "DELETE", value: "DELETE" },
              { label: "PATCH", value: "PATCH" },
            ]}
            placeholder="Select method type"
          />
        </div>

        {/* Content Type */}
        <div className="p-5 space-y-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <Select
            value={contentType || undefined}
            onChange={(option: { label: string; value: string }) =>
              setContentType(option.value)
            }
            options={[
              { label: "JSON (application/json)", value: "application/json" },
              { label: "Form Data (application/x-www-form-urlencoded)", value: "application/x-www-form-urlencoded" },
              { label: "Multipart Form Data (multipart/form-data)", value: "multipart/form-data" },
              { label: "Plain Text (text/plain)", value: "text/plain" },
              { label: "HTML (text/html)", value: "text/html" },
              { label: "XML (application/xml)", value: "application/xml" },
              { label: "PDF (application/pdf)", value: "application/pdf" },
              { label: "Binary (application/octet-stream)", value: "application/octet-stream" },
              { label: "PNG Image (image/png)", value: "image/png" },
              { label: "JPEG Image (image/jpeg)", value: "image/jpeg" },
              { label: "JavaScript (application/javascript)", value: "application/javascript" },
            ]}
            placeholder="Select content type"
          />
        </div>

        {/* Headers */}
        <div className="p-5 border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-800">Headers</h3>
            <button
              onClick={addHeader}
              className="px-3 py-1 text-sm bg-sky-950 text-white rounded-md transition"
            >
              Add Header
            </button>
          </div>
          {headers.map((header, index) => (
            <div key={index} className="p-3 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Header {index + 1}</h4>
                <button
                  onClick={() => removeHeader(index)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <Input placeholder="Key" value={header.key} onChange={(e) => updateHeader(index, "key", e.target.value)} className="w-full" />
                <Input placeholder="Value" value={header.value} onChange={(e) => updateHeader(index, "value", e.target.value)} className="w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Add Params to Test API */}
        <div className="p-5 border-t border-gray-200 space-y-4">
          <h3 className="text-md font-semibold text-gray-800">Add Params to Test API</h3>

          <Tabs defaultValue="requestBody" className="space-y-4">
            <TabsList className="w-full" >
              <TabsTrigger value="requestBody">Request Body</TabsTrigger>
              <TabsTrigger value="pathParams">Path Parameters</TabsTrigger>
              <TabsTrigger value="queryParams">Query Parameters</TabsTrigger>
            </TabsList>

            {/* Request Body */}
            <TabsContent value="requestBody" className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="px-3 py-1 bg-sky-950 text-white text-sm rounded-md"
                >
                  {showJson ? "Hide JSON" : "Add JSON"}
                </button>
                {!showJson && (
                  <button
                    onClick={addParam}
                    className="px-3 py-1 bg-sky-950 text-white text-sm rounded-md"
                  >
                    + Add Parameter
                  </button>
                )}
              </div>

              {/* JSON Textarea */}
              {showJson && (
                <Textarea
                  placeholder="Paste JSON here..."
                  value={RequestBodyJsonText}
                  onChange={(e) => setRequestBodyJsonText(e.target.value)}
                  className="w-full h-40"
                />
              )}

              {/* Key/Value Params */}
              {!showJson && requestParams.length > 0 && (
                <div className="space-y-3 mt-3">
                  {requestParams.map((param, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">Parameter {index + 1}</h4>
                        <button
                          onClick={() => removeParam(index)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex gap-3  flex-col">
                        <Input placeholder="Key" value={param.key} onChange={(e) => updateParam(index, "key", e.target.value)} className="w-full" />
                        <Input placeholder="Value" value={param.value} onChange={(e) => updateParam(index, "value", e.target.value)} className="w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pathParams" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">
                  Path Parameters ({pathParams.length})
                </h4>
                <button
                  onClick={addPathParam}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                >
                  + Add Parameter
                </button>
              </div>

              {pathParams.length > 0 && (
                <div className="space-y-3 mt-3">
                  {pathParams.map((param, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-gray-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">Path Param {index + 1}</h4>
                        <button
                          onClick={() => removePathParam(index)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Input
                          placeholder="Key"
                          value={param.key}
                          onChange={(e) =>
                            updatePathParam(index, "key", e.target.value)
                          }
                          className="w-full"
                        />
                        <Input
                          placeholder="Value"
                          value={param.value}
                          onChange={(e) =>
                            updatePathParam(index, "value", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="queryParams" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">
                  Query Parameters ({queryParams.length})
                </h4>
                <button
                  onClick={addQueryParam}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                >
                  + Add Parameter
                </button>
              </div>

              {queryParams.length > 0 && (
                <div className="space-y-3 mt-3">
                  {queryParams.map((param, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-gray-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-700">Query Param {index + 1}</h4>
                        <button
                          onClick={() => removeQueryParam(index)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Input
                          placeholder="Key"
                          value={param.key}
                          onChange={(e) =>
                            updateQueryParam(index, "key", e.target.value)
                          }
                          className="w-full"
                        />
                        <Input
                          placeholder="Value"
                          value={param.value}
                          onChange={(e) =>
                            updateQueryParam(index, "value", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* buttont ot est api */}
        <div className="p-5" >
          <button
            onClick={testApi}
            className="bg-sky-950 text-white px-4 py-2 rounded-lg w-full"
          >
            Test API
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-white text-gray-700 border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            {t("cancelModal")}
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaveDisabled}
            className={`px-4 py-2 rounded-lg transition ${isSaveDisabled
              ? "bg-white text-gray-700 border border-gray-400 cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
          >
            {t("saveModal")}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
