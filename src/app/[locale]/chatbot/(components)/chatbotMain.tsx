"use client";

import dagre from "@dagrejs/dagre";
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
  XYPosition,
  reconnectEdge,
  Connection
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";

import { ZoomSlider } from "@/components/shadCn/ui/Chatbot/ZoomSlider";
import useChatbotDarkBgStore from "@/store/chatbotDarkBg.store";
import AudioNode from "./CustomNodes/audioNode";
import ButtonNode from "./CustomNodes/buttonNode";
import DocumentNode from "./CustomNodes/documentNode";
import ImageNode from "./CustomNodes/ImageNode";
import StartNode from "./CustomNodes/startNode";
import TextNode from "./CustomNodes/TextNode";
import VideoNode from "./CustomNodes/videoNode";
import ChatbotMiniMap from "./CustomReactFlowComponents/ChatbotMiniMap";
import ChatbotSidebar from "./SideBarActionButtons/ChatbotSideBar";
import DarkAndLightMode from "./SideBarActionButtons/DarkAndLightMode";
import FocusToStartNode from "./SideBarActionButtons/FocusToStartNode";
import CustomEdge from "./CustomEdges/CustomEdge";

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

const edgeTypes = {
  customEdge: CustomEdge,
};

interface BaseNodeData {
  onDelete: (id: string) => void;
  onDataChange?: (data: Record<string, unknown>) => void;
  onAddNodeCallback?: (params: { id: string; type: string; isHandle?: boolean; nodeId?: string; handleType?: 'source' | 'target' }) => void;
  parentNodeId?: string;
  showHandle?: boolean;
  edges?: Edge[];
  [key: string]: unknown;
}

export default function ChatbotMain() {
  const [nodes, setNodes] = useState<Node<BaseNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onAddNodeCallbackRef = useRef<BaseNodeData["onAddNodeCallback"] | null>(null);
  const generateId = (): string => crypto.randomUUID();

  // -------------------- DELETE NODE LOGIC --------------------
  const handleDeleteNode = useCallback((deleteId: string) => {
    setEdges(prevEdges => {
      const incomingEdges = prevEdges.filter(e => e.target === deleteId);
      const outgoingEdges = prevEdges.filter(e => e.source === deleteId);

      // Connect all sources of incoming edges to targets of outgoing edges
      const newEdges: Edge[] = [...prevEdges];
      incomingEdges.forEach(inEdge => {
        outgoingEdges.forEach(outEdge => {
          newEdges.push({
            id: generateId(),
            source: inEdge.source,
            target: outEdge.target,
            type: "customEdge",
            sourceHandle: inEdge.sourceHandle,
            targetHandle: outEdge.targetHandle,
            data: { onAddNodeCallback: onAddNodeCallbackRef.current },
          });
        });
      });

      // Remove all edges connected to deleted node
      return newEdges.filter(e => e.source !== deleteId && e.target !== deleteId);
    });

    setNodes(prev => prev.filter(n => n.id !== deleteId));
  }, []);

  // -------------------- ADD NODE CALLBACK --------------------
  const onAddNodeCallback = useCallback(
    ({
      id: edgeOrHandleId,
      type,
      nodeId,
      handleType,
    }: {
      id: string;
      type: string;
      nodeId?: string;
      handleType?: "source" | "target";
    }) => {
      const createNodeInternal = (position: XYPosition): Node<BaseNodeData> => {
        const newNodeId = generateId();
        return {
          id: newNodeId,
          type: type as NodeTypeKey,
          position,
          data: {
            onDelete: handleDeleteNode,
            onDataChange: (updatedData: Record<string, unknown>) => {
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === newNodeId ? { ...n, data: { ...n.data, ...updatedData } } : n
                )
              );
            },
            onAddNodeCallback,
            topConnected: false,
            bottomConnected: false,
            showTopButton: true,
            showBottomButton: true,
            edges: [],
          },
        };
      };

      // ---- CASE 1: Node added from handle button ----
      if (nodeId && handleType) {
        const newNodeId = generateId();
        const newNode: Node<BaseNodeData> = {
          id: newNodeId,
          type: type as NodeTypeKey,
          position: { x: 0, y: 0 },
          data: {
            onDelete: handleDeleteNode,
            onAddNodeCallback,
            topConnected: false,
            bottomConnected: false,
            showTopButton: true,
            showBottomButton: true,
            edges: [],
          },
        };
        setNodes((prevNodes) => {
          const parentNode = prevNodes.find(n => n.id === nodeId);
          if (!parentNode) return prevNodes;
          newNode.position = { x: parentNode.position.x, y: parentNode.position.y + 200 };
          return [...prevNodes, newNode];
        });

        setEdges((prevEdges) =>
          addEdge(
            {
              id: generateId(),
              source: nodeId,
              target: newNodeId,
              type: "customEdge",
              sourceHandle: handleType === "source" ? `${nodeId}-bottom` : `${nodeId}-top`,
              targetHandle: handleType === "source" ? `${newNodeId}-top` : `${newNodeId}-bottom`,
            },
            prevEdges
          )
        );
      }

      // ---- CASE 2: Node added from edge click ----
      if (edgeOrHandleId) {
        const edge = edges.find((e) => e.id === edgeOrHandleId);
        if (!edge) return;

        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = edge.target ? nodes.find((n) => n.id === edge.target) : null;

        const pos = sourceNode && targetNode
          ? { x: (sourceNode.position.x + targetNode.position.x) / 2, y: (sourceNode.position.y + targetNode.position.y) / 2 + 200 }
          : sourceNode
            ? { x: sourceNode.position.x, y: sourceNode.position.y + 200 }
            : { x: 300, y: 300 };

        const newNode = createNodeInternal(pos);
        setNodes((prevNodes) => [...prevNodes, newNode]);
        setEdges((prevEdges) => {
          const updatedEdges = prevEdges.filter((e) => e.id !== edgeOrHandleId);
          if (edge.target) {
            updatedEdges.push(
              { id: generateId(), source: edge.source, target: newNode.id, type: "customEdge", data: { onAddNodeCallback } },
              { id: generateId(), source: newNode.id, target: edge.target, type: "customEdge", data: { onAddNodeCallback } }
            );
          } else {
            updatedEdges.push({
              id: generateId(),
              source: edge.source,
              target: newNode.id,
              type: "customEdge",
              data: { onAddNodeCallback },
            });
          }
          return updatedEdges;
        });
      }
    },
    [handleDeleteNode, nodes, edges]
  );

  useEffect(() => {
    onAddNodeCallbackRef.current = onAddNodeCallback;
  }, [onAddNodeCallback]);

  // -------------------- NODE & EDGE CHANGES --------------------
  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) =>
        applyNodeChanges(changes, nds) as Node<BaseNodeData>[]
      ),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds) as Edge[]),
    []
  );


const onReconnect = useCallback(
  (oldEdge: Edge, newConnection: Connection) => {
    console.log("Reconnect called!");
    console.log("oldEdge:", oldEdge);
    console.log("newConnection:", newConnection);

    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  },
  []
);

  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({
        ...params,
        type: "customEdge",
        animated: false,
        data: { onAddNodeCallback },
      }, eds)),
    [onAddNodeCallback]
  );

  // -------------------- DRAG & DROP --------------------
  const createNode = useCallback((type: NodeTypeKey, position: XYPosition): Node<BaseNodeData> => {
    const id = crypto.randomUUID();

    return {
      id,
      type,
      position,
      data: {
        onDelete: handleDeleteNode,
        onAddNodeCallback,
        onDataChange: (updatedData: Record<string, unknown>) => {
          setNodes(nds =>
            nds.map(n =>
              n.id === id ? { ...n, data: { ...n.data, ...updatedData } } : n
            )
          );
        },
        topConnected: false,
        bottomConnected: false,
        showTopButton: true,
        showBottomButton: true,
      },
    };
  }, [handleDeleteNode, onAddNodeCallback]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow") as NodeTypeKey;
      if (!type) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode = createNode(type, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, createNode]
  );

  // -------------------- AUTO START NODE --------------------
  useEffect(() => {
    if (!nodes.find((n) => n.type === "startNode")) {
      const startNode: Node<BaseNodeData> = {
        id: generateId(),
        type: "startNode",
        position: { x: 300, y: 50 },
        data: {
          onDelete: (id: string) => setNodes(curr => curr.filter(n => n.id !== id)),
          onAddNodeCallback: onAddNodeCallback,
        },
      };
      setNodes([startNode]);
    }
  }, [nodes, onAddNodeCallback]);

  const { isDarkBg } = useChatbotDarkBgStore();

  // -------------------- DAGRE LAYOUT --------------------
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 350;
  const nodeHeight = 150;

  const getLayoutedElements = useCallback(
    (nodesToLayout: Node<BaseNodeData>[], edgesToLayout: Edge[], direction = "TB") => {
      const isHorizontal = direction === "LR";
      dagreGraph.setGraph({ rankdir: direction });

      nodesToLayout.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edgesToLayout.forEach((edge) => {
        if (edge.source && edge.target) {
          dagreGraph.setEdge(edge.source, edge.target);
        }
      });

      dagre.layout(dagreGraph);

      const newNodes = nodesToLayout.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          targetPosition: isHorizontal ? Position.Left : Position.Top,
          sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
        };
      });

      return { nodes: newNodes, edges: edgesToLayout };
    },
    [dagreGraph]
  );

  const onLayout = useCallback(
    (direction: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, getLayoutedElements]
  );

  // -------------------- PASS EDGE INFO TO NODES --------------------
  const edgesWithCallback: Edge[] = edges.map(edge => ({
    ...edge,
    data: {
      ...edge.data,
      onAddNodeCallback: onAddNodeCallback,
      edges,
    }
  }));

  const nodesWithEdges = nodes.map(node => {
    const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
    const topConnected = connectedEdges.some(e => e.target === node.id);
    const bottomConnected = connectedEdges.some(e => e.source === node.id);

    return {
      ...node,
      data: {
        ...node.data,
        edges: connectedEdges,
        topConnected,
        bottomConnected,
        showTopButton: !topConnected,
        showBottomButton: !bottomConnected,
      },
    };
  });

  return (
    <div className="flex w-full h-screen bg-gray-50 text-gray-900 relative">
      <div className="flex-1 bg-white">
        <ReactFlow
          key={`flow-${edges.length}-${nodes.length}`}
          nodes={nodesWithEdges}
          edges={edgesWithCallback}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="intersection-flow"
          proOptions={{ hideAttribution: true }}
          colorMode={isDarkBg ? "dark" : "light"}
          selectNodesOnDrag={false}
          onReconnect={onReconnect}
        >
          <ZoomSlider position="top-center" />
          <FocusToStartNode />
          <DarkAndLightMode />
          <ChatbotSidebar onLayout={onLayout} />
          <ChatbotMiniMap nodes={nodes} />
          <Background variant={BackgroundVariant.Lines} />
          <Controls position="top-right" orientation="horizontal" />
        </ReactFlow>
      </div>
    </div>
  );
}
