import { EdgeProps, getEdgeCenter, getBezierPath } from "@xyflow/react";
import EdgeAddButton from "./addEdgeButton";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}: EdgeProps) {
  
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Edge line */}
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        className="react-flow__edge-path stroke-gray-400 fill-transparent"
      />

      {/* Add node button at center */}
      <foreignObject
        width={24}
        height={24}
        x={edgeCenterX - 12} // 24/2
        y={edgeCenterY - 12} // 24/2
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <EdgeAddButton id={id} data={data} />
      </foreignObject>
    </>
  );
}
