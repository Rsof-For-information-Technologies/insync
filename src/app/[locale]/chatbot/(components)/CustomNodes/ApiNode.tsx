"use client";

import { useState, useMemo, useEffect } from "react";
import { Position, Edge } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import EdgeAddButton from "../CustomEdges/addEdgeButton";
import ApinodeModal from "./NodeComponents/ApinodeModal";

interface KeyValuePair {
  key: string;
  value: string;
}

export interface NodeModalSavePayload {
  apiConfig: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  contentType: string;
  headers: KeyValuePair[];
  pathParams: KeyValuePair[];
  queryParams: KeyValuePair[];
  requestParams: KeyValuePair[];
  RequestBodyJsonText: string;
}

interface ApiNodeData {
  edges?: Edge[];
  apiConfig?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  contentType?: string;
  headers?: KeyValuePair[];
  pathParams?: KeyValuePair[];
  queryParams?: KeyValuePair[];
  requestParams?: KeyValuePair[];
  RequestBodyJsonText?: string;
  onDelete: (id: string) => void;
  onDataChange?: (data: NodeModalSavePayload) => void;
  onAddNodeCallback?: (params: { id: string; type: string }) => void;
}

interface ApiNodeProps {
  id: string;
  data: ApiNodeData;
}

export default function ApiNode({ id, data }: ApiNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal states
  const [apiConfig, setApiConfig] = useState(data.apiConfig || "");
  const [method, setMethod] = useState(data.method || ("" as "" | "GET" | "POST" | "PUT" | "DELETE" | "PATCH"));
  const [contentType, setContentType] = useState(data.contentType || "");
  const [headers, setHeaders] = useState(data.headers || []);
  const [pathParams, setPathParams] = useState(data.pathParams || []);
  const [queryParams, setQueryParams] = useState(data.queryParams || []);
  const [requestParams, setRequestParams] = useState(data.requestParams || []);
  const [RequestBodyJsonText, setRequestBodyJsonText] = useState(data.RequestBodyJsonText || "");

  // Handle connection state
  const { isTopHandleConnected, isBottomHandleConnected } = useMemo(() => {
    const edgesState = data.edges || [];
    return {
      isTopHandleConnected: edgesState.some((e) => e.target === id),
      isBottomHandleConnected: edgesState.some((e) => e.source === id),
    };
  }, [data.edges, id]);

  // Notify parent on data change
  const handleDataChange = () => {
    data.onDataChange?.({
      apiConfig,
      method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      contentType,
      headers,
      pathParams,
      queryParams,
      requestParams,
      RequestBodyJsonText,
    });
  };

  const handleSave = (payload: NodeModalSavePayload) => {
    setApiConfig(payload.apiConfig);
    setMethod(payload.method);
    setContentType(payload.contentType);
    setHeaders(payload.headers);
    setPathParams(payload.pathParams);
    setQueryParams(payload.queryParams);
    setRequestParams(payload.requestParams);
    setRequestBodyJsonText(payload.RequestBodyJsonText);

    handleDataChange();
    setIsModalOpen(false);
  };

  useEffect(() => {
    handleDataChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiConfig, method, contentType, headers, pathParams, queryParams, requestParams, RequestBodyJsonText]);

  return (
    <>
      <div className="relative group flex flex-col items-center">
        <button
          onClick={() => data.onDelete(id)}
          className="absolute -top-4 right-[-14px] text-gray-400 hover:text-red-500 z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* <div
          className="w-[350px] min-h-[60px] bg-white border border-gray-200 shadow-sm flex cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-1 bg-black"></div>
          <div className="flex-1 p-3 text-sm text-gray-800 leading-relaxed">
            <span className="text-gray-400 italic">Click to edit API</span>
          </div>
        </div> */}
        <div
          className="w-[350px] min-h-[60px] bg-white border border-gray-200 shadow-sm flex cursor-pointer flex-col"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-1 bg-black"></div>
          <div className="flex-1 p-3 text-sm text-gray-800 leading-relaxed">
            <span className="text-gray-400 italic">Click to edit API</span>

            {/* --- Show collected data below --- */}
            {apiConfig && (
              <div className="mt-2 p-2 bg-gray-50 border rounded text-xs text-gray-700 space-y-1">
                <div><strong>API:</strong> {apiConfig}</div>
                <div><strong>Method:</strong> {method}</div>
                <div><strong>Content-Type:</strong> {contentType}</div>
                {headers.length > 0 && (
                  <div>
                    <strong>Headers:</strong> {headers.map(h => `${h.key}:${h.value}`).join(", ")}
                  </div>
                )}
                {pathParams.length > 0 && (
                  <div>
                    <strong>Path Params:</strong> {pathParams.map(p => `${p.key}:${p.value}`).join(", ")}
                  </div>
                )}
                {queryParams.length > 0 && (
                  <div>
                    <strong>Query Params:</strong> {queryParams.map(q => `${q.key}:${q.value}`).join(", ")}
                  </div>
                )}
                {requestParams.length > 0 && (
                  <div>
                    <strong>Request Params:</strong> {requestParams.map(r => `${r.key}:${r.value}`).join(", ")}
                  </div>
                )}
                {RequestBodyJsonText && (
                  <div>
                    <strong>JSON:</strong> {RequestBodyJsonText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top Handle */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <CustomHandle type="target" position={Position.Top} id={`${id}-top`} connectionCount={1} />
            {!isTopHandleConnected && data.onAddNodeCallback && (
              <div className="absolute left-[24px] top-1/2 transform -translate-y-1/2">
                <EdgeAddButton
                  id={`${id}-top`}
                  data={{
                    onAddNodeCallback: data.onAddNodeCallback,
                    isHandle: true,
                    nodeId: id,
                    handleType: "target",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Handle */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <CustomHandle type="source" position={Position.Bottom} id={`${id}-bottom`} connectionCount={1} />
            {!isBottomHandleConnected && data.onAddNodeCallback && (
              <div className="absolute left-[24px] top-1/2 transform -translate-y-1/2">
                <EdgeAddButton
                  id={`${id}-bottom`}
                  data={{
                    onAddNodeCallback: data.onAddNodeCallback,
                    isHandle: true,
                    nodeId: id,
                    handleType: "source",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ApinodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          existingData={{
            apiConfig,
            method: method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
            contentType,
            headers,
            pathParams,
            queryParams,
            requestParams,
            RequestBodyJsonText,
          }}
        />
      )}
    </>
  );
}
