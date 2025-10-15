"use client";

import useChatbotDarkBgStore from "@/store/chatbotDarkBg.store";
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
import { useCallback, useEffect, useRef, useState } from "react";
import CustomEdge from "./CustomEdges/CustomEdge";
import AudioNode from "./CustomNodes/audioNode";
import ButtonNode from "./CustomNodes/buttonNode";
import DocumentNode from "./CustomNodes/documentNode";
import ImageNode from "./CustomNodes/ImageNode";
import StartNode from "./CustomNodes/startNode";
import TextNode from "./CustomNodes/TextNode";
import VideoNode from "./CustomNodes/videoNode";
import ChatbotMiniMap from "./CustomReactFlowComponents/ChatbotMiniMap";
import ChatbotSidebar from './SideBarActionButtons/ChatbotSideBar';
import FocusToStartNode from './SideBarActionButtons/FocusToStartNode';
import NodeContextMenu from "./CustomReactFlowComponents/NodeContextMenu";

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

// Define the structure for the context menu state
interface MenuState {
  id: string;
  top?: number | false;
  left?: number | false;
  right?: number | false;
  bottom?: number | false;
}

export default function ChatbotMain() {
  const [nodes, setNodes] = useState<Node<BaseNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds) as Node<BaseNodeData>[];
        return updated;
      }),
    [edges]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
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
        position: { x: 300, y: 100 },
        data: {
          onDelete: (id: string) =>
            setNodes((curr) => curr.filter((n) => n.id !== id)),
        },
      };
      setNodes([startNode]);
    }
  }, [nodes]);

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
        return newEdges;
      });
    },
    [nodes]
  );

  // =====================
  // Node Drag - Highlight Overlaps
  // =====================
  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node<BaseNodeData>) => {
      const intersections = getIntersectingNodes(node).map((n) => n.id);

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          className: intersections.includes(n.id) ? "highlight" : "",
        }))
      );
    },
    [getIntersectingNodes]
  );

  const edgeTypes = {
    customEdge: CustomEdge,
  };

  const { isDarkBg } = useChatbotDarkBgStore();

  // =====================
  // Auto Layout with Dagre
  // =====================
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 400; // Approximate width of your nodes
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

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node<BaseNodeData>) => {
      // Prevent native context menu from showing
      event.preventDefault();

      if (!ref.current) return;

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();

      // Calculate position relative to the viewport
      const menuWidth = 200; // Approximate menu width
      const menuHeight = 200; // Approximate menu height

      setMenu({
        id: node.id,
        top: event.clientY < pane.height - menuHeight ? event.clientY : false,
        left: event.clientX < pane.width - menuWidth ? event.clientX : false,
        right: event.clientX >= pane.width - menuWidth ? pane.width - event.clientX + pane.left : false,
        bottom: event.clientY >= pane.height - menuHeight ? pane.height - event.clientY + pane.top : false,
      });
    },
    [setMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div className="flex w-full h-screen bg-gray-50 text-gray-900 relative">

      <div className="flex-1 bg-white">
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDrag={onNodeDrag}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          className='intersection-flow'
          proOptions={{ hideAttribution: true }}
          colorMode={isDarkBg ? "dark" : "light"}
          selectNodesOnDrag={false}
          onlyRenderVisibleElements={true}
        >
          <FocusToStartNode />
          <ChatbotSidebar onLayout={onLayout} />
          <ChatbotMiniMap nodes={nodes} />
          <Background variant={BackgroundVariant.Lines} />
          <Controls position="top-right" orientation="horizontal" />
          {menu && <NodeContextMenu onClick={onPaneClick} {...menu} />}
        </ReactFlow>
      </div>
    </div>
  );
}
