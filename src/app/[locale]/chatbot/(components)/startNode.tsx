"use client";

import { Handle, Position } from "@xyflow/react";

interface StartNodeProps {
  data: {
    onDataChange?: (data: Record<string, unknown>) => void;
    onDelete?: (id: string) => void;
  };
}

export default function StartNode({ data }: StartNodeProps) {
    console.log("Rendering StartNode with data:", data);
  return (
    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold select-none">
      S
      {/* Only source handle since start node usually outputs data */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
