import { Position } from "@xyflow/react";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";

export default function StartNode() {
  return (
    <div className="w-[98px] h-[98px] bg-blue-500 text-white rounded-full flex items-center justify-center font-bold select-none">
      Start
      <CustomHandle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
