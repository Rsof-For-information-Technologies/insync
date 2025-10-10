"use client";

import { Edge, Node, Panel } from "@xyflow/react";
import {
    FileText,
    Image as ImageIcon,
    Music,
    Save,
    SquareMousePointer,
    Type,
    Video
} from "lucide-react";
import CustomActionButton from "../CustomReactFlowComponents/CustomActionButton";
import AutoLayoutButtons from "./AutoLayoutButtons";
import DownloadChatbotImageButton from "./DownloadChatbotImageButton";

type NodeTypeKey =
    | "textNode"
    | "imageNode"
    | "videoNode"
    | "documentNode"
    | "audioNode"
    | "buttonNode";

interface ChatbotSidebarProps {
    nodes: Node[];
    edges: Edge[];
    onSave?: () => void;
    onLayout?: (direction: "TB" | "LR") => void;
}

export default function ChatbotSidebar({ nodes, edges, onSave, onLayout }: ChatbotSidebarProps) {
    const nodeButtons: {
        type: NodeTypeKey;
        icon: JSX.Element;
        title: string;
        hoverColor: string;
        tooltip: string;
    }[] = [
            {
                type: "textNode",
                icon: <Type size={18} />,
                title: "Text Node",
                hoverColor: "hover:bg-blue-500",
                tooltip: "Drag to add a text message node",
            },
            {
                type: "imageNode",
                icon: <ImageIcon size={18} />,
                title: "Image Node",
                hoverColor: "hover:bg-green-500",
                tooltip: "Drag to add an image node",
            },
            {
                type: "videoNode",
                icon: <Video size={18} />,
                title: "Video Node",
                hoverColor: "hover:bg-yellow-500",
                tooltip: "Drag to add a video node",
            },
            {
                type: "documentNode",
                icon: <FileText size={18} />,
                title: "Document Node",
                hoverColor: "hover:bg-purple-500",
                tooltip: "Drag to add a document node",
            },
            {
                type: "audioNode",
                icon: <Music size={18} />,
                title: "Audio Node",
                hoverColor: "hover:bg-pink-500",
                tooltip: "Drag to add an audio node",
            },
            {
                type: "buttonNode",
                icon: <SquareMousePointer size={18} />,
                title: "Button Node",
                hoverColor: "hover:bg-red-500",
                tooltip: "Drag to add an action button node",
            },
        ];

    const handleSave = () => {
        if (onSave) {
            onSave();
        } else {
            console.log("Flow saved", JSON.stringify({ nodes, edges }));
        }
    };

    return (
        <Panel position="top-left" className="flex flex-col items-center gap-5 p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl pointer-events-auto z-10">
            {nodeButtons.map((btn) => (
                <CustomActionButton
                    key={btn.type}
                    icon={btn.icon}
                    title={btn.title}
                    ariaLabel={`Add ${btn.title}`}
                    draggable={true}
                    onDragStart={(e) =>
                        e.dataTransfer.setData("application/reactflow", btn.type)
                    }
                    tooltip={btn.tooltip}
                    tooltipPosition="right"
                    hoverColor={btn.hoverColor}
                />
            ))}

            <div className="w-10 border-b border-gray-300 my-3"></div>

            {onLayout && (<AutoLayoutButtons onLayout={onLayout} />)}

            <CustomActionButton
                icon={<Save size={18} />}
                title="Save Flow"
                ariaLabel="Save Chatbot Flow"
                onClick={handleSave}
                tooltip="Save your chatbot flow"
                tooltipPosition="right"
                hoverColor="hover:bg-gray-800"
            />

            <DownloadChatbotImageButton />

        </Panel>
    );
}
