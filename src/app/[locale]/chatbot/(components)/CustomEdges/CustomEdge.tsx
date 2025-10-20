import { EdgeProps, getEdgeCenter, getStraightPath } from "@xyflow/react";
import EdgeAddButton from "./addEdgeButton";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
  ...rest // <- important
}: EdgeProps) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <path
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        className="react-flow__edge-path stroke-gray-400 fill-transparent"
        {...rest} // <- important for reconnect
      />

      <foreignObject
        width={24}
        height={24}
        x={edgeCenterX - 12}
        y={edgeCenterY - 12}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <EdgeAddButton id={id} data={data} />
      </foreignObject>
    </>
  );
}

