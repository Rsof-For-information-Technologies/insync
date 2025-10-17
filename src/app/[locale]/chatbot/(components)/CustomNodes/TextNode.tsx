"use client";

import { useState, useMemo, useEffect } from "react";
import { Position, Edge } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import EdgeAddButton from "../CustomEdges/addEdgeButton";
import NodeModal from "./NodeComponents/nodeModal";

interface MediaOption {
  label: string;
  value: string;
}

interface TextNodeProps {
  id: string;
  data: {
    edges?: Edge[];
    onDelete: (id: string) => void;
    onDataChange?: (updatedData: Record<string, unknown>) => void;
    onAddNodeCallback?: (params: { id: string; type: string }) => void;
  };
}

export default function TextNode({ id, data }: TextNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [acceptMedia, setAcceptMedia] = useState(false);
  const [selectedMediaOption, setSelectedMediaOption] = useState<MediaOption | null>(null);
  const [variableValue, setVariableValue] = useState("");

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
    data.onDataChange?.({ text, acceptMedia, selectedMediaOption, variableValue });
  };

  const handleSave = () => {
    setDisplayText(text);
    handleDataChange();
    setIsModalOpen(false);
  };

  useEffect(() => {
    handleDataChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, acceptMedia, selectedMediaOption, variableValue]);

  return (
    <>
      <div className="relative group flex flex-col items-center">
        {/* Delete button */}
        <button
          onClick={() => data.onDelete(id)}
          className="absolute -top-4 right-[-14px] text-gray-400 hover:text-red-500 z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Node container */}
        <div
          className="w-[350px] min-h-[60px] bg-white border border-gray-200 shadow-sm flex cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-1 bg-black"></div>
          <div className="flex-1 p-3 text-sm text-gray-800 leading-relaxed">
            {displayText ? (
              <div
                className="text-[13px]"
                dangerouslySetInnerHTML={{
                  __html: displayText
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
              />
            ) : (
              <span className="text-gray-400 italic">Click to edit</span>
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
            <CustomHandle type="source" position={Position.Bottom} id={`${id}-bottom`} connectionCount={1}/>
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

      {/* Modal */}
      {isModalOpen && (
        <NodeModal
          isOpen={isModalOpen}
          text={text}
          variableValue={variableValue}
          acceptMedia={acceptMedia}
          selectedMediaOption={selectedMediaOption}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          setText={setText}
          setVariableValue={setVariableValue}
          setAcceptMedia={setAcceptMedia}
          setSelectedMediaOption={setSelectedMediaOption}
        />
      )}
    </>
  );
}
