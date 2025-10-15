"use client";

import { useState } from "react";
import { Position } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import NodeModal from "./NodeComponents/nodeModal";

interface MediaOption {
  label: string;
  value: string;
}

interface TextNodeProps {
  id: string;
  data: {
    onDelete: (id: string) => void;
    onDataChange?: (updatedData: Record<string, unknown>) => void;
  };
}

export default function TextNode({ id, data }: TextNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [acceptMedia, setAcceptMedia] = useState(false);
  const [selectedMediaOption, setSelectedMediaOption] = useState<MediaOption | null>(null);
  const [variableValue, setVariableValue] = useState("");

  // Send updated data back to parent / React Flow
  const handleDataChange = () => {
    data.onDataChange?.({ text, acceptMedia, selectedMediaOption, variableValue });
  };

  const handleSave = () => {
    setDisplayText(text);
    handleDataChange();
    setIsModalOpen(false);
  };

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

        {/* Handles */}
        <CustomHandle type="target" position={Position.Left} id={`${id}-a`} />
        <CustomHandle type="source" position={Position.Right} id={`${id}-b`} />
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
