"use client";
import { useMemo } from "react";
import { Position, Edge } from "@xyflow/react";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import EdgeAddButton from "../CustomEdges/addEdgeButton";

interface StartNodeProps {
  id: string;
  data: {
    edges?: Edge[];
    onDataChange?: (data: Record<string, unknown>) => void;
    onDelete?: (id: string) => void;
    onAddNodeCallback?: (params: { id: string; type: string }) => void;
  };
}

export default function StartNode({ id, data }: StartNodeProps) {

  const { isBottomHandleConnected } = useMemo(() => {
    const edgesState = data.edges || [];

    return {
      isBottomHandleConnected: edgesState.some((e) => e.source === id),
    };
  }, [data.edges, id]);

  return (
    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold select-none">
      S
      {/* Only source handle since start node usually outputs data */}
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
  );
}
