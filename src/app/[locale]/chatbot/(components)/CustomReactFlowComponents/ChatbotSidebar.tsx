"use client";

import { Edge, Node } from "@xyflow/react";
import {
    FileText,
    Image as ImageIcon,
    Music,
    Save,
    SquareMousePointer,
    Type,
    Video,
} from "lucide-react";

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
}

export default function ChatbotSidebar({ nodes, edges, onSave }: ChatbotSidebarProps) {
    const nodeButtons: {
        type: NodeTypeKey;
        icon: JSX.Element;
        title: string;
        hoverColor: string;
    }[] = [
            {
                type: "textNode",
                icon: <Type size={18} />,
                title: "Text Node",
                hoverColor: "hover:bg-blue-500",
            },
            {
                type: "imageNode",
                icon: <ImageIcon size={18} />,
                title: "Image Node",
                hoverColor: "hover:bg-green-500",
            },
            {
                type: "videoNode",
                icon: <Video size={18} />,
                title: "Video Node",
                hoverColor: "hover:bg-yellow-500",
            },
            {
                type: "documentNode",
                icon: <FileText size={18} />,
                title: "Document Node",
                hoverColor: "hover:bg-purple-500",
            },
            {
                type: "audioNode",
                icon: <Music size={18} />,
                title: "Audio Node",
                hoverColor: "hover:bg-pink-500",
            },
            {
                type: "buttonNode",
                icon: <SquareMousePointer size={18} />,
                title: "Button Node",
                hoverColor: "hover:bg-red-500",
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
        <div className="absolute top-[0] left-6 flex flex-col items-center gap-5 p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl pointer-events-auto z-10">
            {nodeButtons.map((btn) => (
                <button
                    key={btn.type}
                    draggable
                    onDragStart={(e) =>
                        e.dataTransfer.setData("application/reactflow", btn.type)
                    }
                    title={btn.title}
                    className={`p-3 rounded-full bg-gray-100 ${btn.hoverColor} hover:text-white transition`}
                >
                    {btn.icon}
                </button>
            ))}

            <div className="w-10 border-b border-gray-300 my-3"></div>

            <button
                onClick={handleSave}
                title="Save Flow"
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white transition"
            >
                <Save size={18} />
            </button>
        </div>
    );
}
