import { MiniMap, Node } from "@xyflow/react";

interface ChatbotMiniMapProps {
    nodes: Node[];
}

const ChatbotMiniMap = ({ nodes }: ChatbotMiniMapProps) => (
    <MiniMap
        nodeStrokeWidth={2}
        zoomable
        pannable
        nodeColor={(node) => {
            switch (node.type) {
                case "startNode":
                    return "#1D4ED8";
                case "textNode":
                    return "#3B82F6";
                case "imageNode":
                    return "#22C55E";
                case "videoNode":
                    return "#EAB308";
                case "documentNode":
                    return "#8B5CF6";
                case "audioNode":
                    return "#EC4899";
                case "buttonNode":
                    return "#EF4444";
                default:
                    return "#ccc";
            }
        }}
    />
);

export default ChatbotMiniMap;
