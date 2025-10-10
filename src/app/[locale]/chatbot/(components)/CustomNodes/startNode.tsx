"use client";

import { Position } from "@xyflow/react";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";

interface StartNodeProps {
  data: {
    onDataChange?: (data: Record<string, unknown>) => void;
    onDelete?: (id: string) => void;
  };
}

export default function StartNode({ data }: StartNodeProps) {
  return (
    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold select-none">
      S
      {/* Only source handle since start node usually outputs data */}
      <CustomHandle type="source" position={Position.Bottom} />
    </div>
  );
}
