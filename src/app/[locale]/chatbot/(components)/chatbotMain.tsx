"use client";

import dagre from '@dagrejs/dagre';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Position,
  ReactFlow,
  useReactFlow,
  XYPosition
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";


import useChatbotDarkBgStore from "@/store/chatbotDarkBg.store";
import CustomEdge from "./CustomEdges/CustomEdge";
import AudioNode from "./CustomNodes/audioNode";
import ButtonNode from "./CustomNodes/buttonNode";
import DocumentNode from "./CustomNodes/documentNode";
import ImageNode from "./CustomNodes/ImageNode";
import StartNode from "./CustomNodes/startNode";
import TextNode from "./CustomNodes/TextNode";
import VideoNode from "./CustomNodes/videoNode";
import ChatbotMiniMap from "./CustomReactFlowComponents/ChatbotMiniMap";
import ChatbotSidebar from "./SideBarActionButtons/ChatbotSidebar";
import DarkAndLightMode from "./SideBarActionButtons/DarkAndLightMode";

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
        setEdges((curr) => curr.filter((e) => e.source !== deleteId && e.target !== deleteId));
      },
      onDataChange: (updatedData: Record<string, unknown>) => {
        setNodes((nds) => {
          const newNodes = nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...updatedData } } : n);
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
      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);
        propagateData(edges, updatedNodes); // use updatedNodes
        return updatedNodes;
      });
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
          { ...params, animated: true, type: "customEdge" },
          eds
        );
        propagateData(newEdges, nodes); // auto-propagate when connected
        return newEdges;
      });
    },
    [nodes, propagateData]
  );

  const edgeTypes = {
    customEdge: CustomEdge,
  };

  const { isDarkBg } = useChatbotDarkBgStore();

  // =====================
  // Auto Layout with Dagre
  // =====================
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 350; // Approximate width of your nodes
  const nodeHeight = 150; // Approximate height of your nodes

  const getLayoutedElements = useCallback(
    (nodesToLayout: Node<BaseNodeData>[], edgesToLayout: Edge[], direction = "TB") => {
      const isHorizontal = direction === "LR";
      dagreGraph.setGraph({ rankdir: direction });

      nodesToLayout.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edgesToLayout.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      const newNodes = nodesToLayout.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode: Node<BaseNodeData> = {
          ...node,
          targetPosition: isHorizontal ? Position.Left : Position.Top,
          sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
        };

        return newNode;
      });

      return { nodes: newNodes, edges: edgesToLayout };
    },
    [dagreGraph]
  );

  const onLayout = useCallback(
    (direction: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, getLayoutedElements]
  );

  return (
    <div className="flex w-full h-screen bg-gray-50 text-gray-900 relative">

      <div className="flex-1 bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          proOptions={{ hideAttribution: true }}
          colorMode={isDarkBg ? "dark" : "light"}
        >
          <DarkAndLightMode />
          <ChatbotSidebar nodes={nodes} edges={edges} onLayout={onLayout} />
          <ChatbotMiniMap nodes={nodes} />
          <Background variant={BackgroundVariant.Lines} />
          <Controls position="top-right" orientation="horizontal" />
        </ReactFlow>
      </div>
    </div>
  );
}
