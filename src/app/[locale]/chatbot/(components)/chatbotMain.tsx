"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Type,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  SquareMousePointer,
  Save,
} from "lucide-react";

import TextNode from "./TextNode";
import ImageNode from "./ImageNode";
import VideoNode from "./videoNode";
import DocumentNode from "./documentNode";
import AudioNode from "./audioNode";
import ButtonNode from "./buttonNode";
import StartNode from "./startNode";

type NodeTypeKey =
  | "startNode"
  | "textNode"
  | "imageNode"
  | "videoNode"
  | "documentNode"
  | "audioNode"
  | "buttonNode";

const nodeTypes = {
  startNode: StartNode,
  textNode: TextNode,
  imageNode: ImageNode,
  videoNode: VideoNode,
  documentNode: DocumentNode,
  audioNode: AudioNode,
  buttonNode: ButtonNode,
};

interface BaseNodeData {
  onDelete: (id: string) => void;
  onDataChange?: (data: Record<string, unknown>) => void;
  [key: string]: unknown;
}

export default function ChatbotMain() {
  const [nodes, setNodes] = useState<Node<BaseNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds) as Node<BaseNodeData>[];
        propagateData(edges, updated);
        return updated;
      }),
    [edges]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        propagateData(updated, nodes);
        return updated;
      }),
    [nodes]
  );

  const generateId = () => crypto.randomUUID();

  // =====================
  // Auto-add Start Node
  // =====================
  useEffect(() => {
    if (!nodes.find((n) => n.type === "startNode")) {
      const startNode: Node<BaseNodeData> = {
        id: generateId(),
        type: "startNode",
        position: { x: 300, y: 50 },
        data: {
          onDelete: (id: string) =>
            setNodes((curr) => curr.filter((n) => n.id !== id)),
        },
      };
      setNodes([startNode]);
    }
  }, [nodes]);

  // =====================
  // Data Propagation Logic
  // =====================
  const propagateData = useCallback(
    (currentEdges: Edge[], currentNodes: Node<BaseNodeData>[]) => {
      const updatedNodes = currentNodes.map((n) => ({ ...n }));

      currentEdges.forEach((edge) => {
        const sourceNode = currentNodes.find((n) => n.id === edge.source);
        const targetNode = updatedNodes.find((n) => n.id === edge.target);

        if (sourceNode && targetNode && sourceNode.data && targetNode.data) {
          Object.keys(sourceNode.data).forEach((key) => {
            if (key !== "onDelete" && key !== "onDataChange") {
              targetNode.data[key] = sourceNode.data[key];
            }
          });
          targetNode.data.onDataChange?.({ ...sourceNode.data });
        }
      });

      setNodes(updatedNodes);
    },
    []
  );

  // =====================
  // Node Creation
  // =====================
  const createNode = (type: NodeTypeKey, position: XYPosition) => {
    const id = generateId();
    const baseData: BaseNodeData = {
      onDelete: (deleteId: string) => {
        setNodes((curr) => curr.filter((n) => n.id !== deleteId));
        setEdges((curr) =>
          curr.filter((e) => e.source !== deleteId && e.target !== deleteId)
        );
      },
      onDataChange: (updatedData: Record<string, unknown>) => {
        setNodes((nds) => {
          const newNodes = nds.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...updatedData } } : n
          );
          propagateData(edges, newNodes); // automatically propagate
          return newNodes;
        });
      },
    };
    return { id, type, position, data: baseData };
  };

  // =====================
  // Drag & Drop
  // =====================
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow") as NodeTypeKey;
      if (!type) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode = createNode(type, position);
      setNodes((nds) => nds.concat(newNode));
      propagateData(edges, nodes); // immediately propagate
    },
    [screenToFlowPosition, edges, nodes]
  );

  // =====================
  // Connect Nodes
  // =====================
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          { ...params, animated: true, style: { stroke: "#3B82F6", strokeWidth: 2 } },
          eds
        );
        propagateData(newEdges, nodes); // auto-propagate when connected
        return newEdges;
      });
    },
    [nodes, propagateData]
  );

  // =====================
  // Sidebar Nodes
  // =====================
  const nodeButtons: { type: NodeTypeKey; icon: JSX.Element; title: string; hoverColor: string }[] = [
    { type: "textNode", icon: <Type size={18} />, title: "Text Node", hoverColor: "hover:bg-blue-500" },
    { type: "imageNode", icon: <ImageIcon size={18} />, title: "Image Node", hoverColor: "hover:bg-green-500" },
    { type: "videoNode", icon: <Video size={18} />, title: "Video Node", hoverColor: "hover:bg-yellow-500" },
    { type: "documentNode", icon: <FileText size={18} />, title: "Document Node", hoverColor: "hover:bg-purple-500" },
    { type: "audioNode", icon: <Music size={18} />, title: "Audio Node", hoverColor: "hover:bg-pink-500" },
    { type: "buttonNode", icon: <SquareMousePointer size={18} />, title: "Button Node", hoverColor: "hover:bg-red-500" },
  ];

  return (
    <div className="flex w-full h-screen bg-gray-50 text-gray-900 relative">
      {/* Sidebar */}
      <div className="absolute top-[0] left-6 flex flex-col items-center gap-5 p-4 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl pointer-events-auto z-10">
        {nodeButtons.map((btn) => (
          <button
            key={btn.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("application/reactflow", btn.type)}
            title={btn.title}
            className={`p-3 rounded-full bg-gray-100 ${btn.hoverColor} hover:text-white transition`}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-10 border-b border-gray-300 my-3"></div>

        <button
          onClick={() => console.log("Flow saved", JSON.stringify({ nodes, edges }))}
          title="Save Flow"
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-800 hover:text-white transition"
        >
          <Save size={18} />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
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
          <Background variant={BackgroundVariant.Cross} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
