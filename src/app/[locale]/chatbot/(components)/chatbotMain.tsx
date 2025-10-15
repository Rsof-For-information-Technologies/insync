"use client";

import useChatbotDarkBgStore from "@/store/chatbotDarkBg.store";
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
import DarkAndLightMode from "./SideBarActionButtons/DarkAndLightMode";
import { ZoomSlider } from '@/components/shadCn/ui/Chatbot/ZoomSlider';
import { NodeSearch } from '@/components/shadCn/ui/Chatbot/NodeSearch';
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

const edgeTypes = {
  customEdge: CustomEdge,
};

interface BaseNodeData {
  onDelete: (id: string) => void;
  onDataChange?: (data: Record<string, unknown>) => void;
  onAddNodeCallback?: (params: { id: string; type: string }) => void;
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
  

  const generateId = (): string => crypto.randomUUID();

  // --- Add Node Callback ---
  const onAddNodeCallback = useCallback(({ id: edgeId, type }: { id: string; type: string }) => {
    // Find the edge that was clicked
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) {
      console.error('Edge not found:', edgeId);
      return;
    }

    // Create new node position (between source and target or from source if no target)
    const sourceNode = nodes.find(n => n.id === edge.source);
    
    let newNodePosition: XYPosition;
    
    if (edge.target && sourceNode) {
      // Edge has both source and target - position between them
      const targetNode = nodes.find(n => n.id === edge.target);
      if (targetNode) {
        newNodePosition = {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2 + 200,
        };
      } else {
        // Target node not found, position below source
        newNodePosition = {
          x: sourceNode.position.x,
          y: sourceNode.position.y + 200,
        };
      }
    } else if (sourceNode) {
      // Free edge (only source) - position below source
      newNodePosition = {
        x: sourceNode.position.x,
        y: sourceNode.position.y + 200,
      };
    } else {
      // Fallback position
      newNodePosition = { x: 300, y: 300 };
    }

    // Create new node
    const newNodeId = generateId();
    const newNode: Node<BaseNodeData> = {
      id: newNodeId,
      type: type as NodeTypeKey,
      position: newNodePosition,
      data: {
        onDelete: (deleteId: string) => {
          setEdges((currEdges) => {
            const incomingEdges = currEdges.filter(e => e.target === deleteId);
            const outgoingEdges = currEdges.filter(e => e.source === deleteId);

            const newEdges: Edge[] = [];

            // Reconnect all incoming to all outgoing edges
            incomingEdges.forEach(inc => {
              outgoingEdges.forEach(out => {
                newEdges.push({
                  id: crypto.randomUUID(),
                  source: inc.source,
                  target: out.target,
                  type: "customEdge",
                  data: { onAddNodeCallback },
                });
              });
            });

            // Keep all edges except ones connected to the deleted node
            return [
              ...currEdges.filter(e => e.source !== deleteId && e.target !== deleteId),
              ...newEdges
            ];
          });

          setNodes((currNodes) => currNodes.filter(n => n.id !== deleteId));
        },
        onDataChange: (updatedData: Record<string, unknown>) => {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === newNodeId ? { ...n, data: { ...n.data, ...updatedData } } : n
            )
          );
        },
        onAddNodeCallback: onAddNodeCallback,
      },
    };

    // Update edges based on whether it's a free edge or connected edge
    if (edge.target) {
      // Connected edge - replace with two new edges
      const newEdge1: Edge = {
        id: generateId(),
        source: edge.source,
        target: newNodeId,
        type: "customEdge",
        data: { onAddNodeCallback },
      };

      const newEdge2: Edge = {
        id: generateId(),
        source: newNodeId,
        target: edge.target,
        type: "customEdge",
        data: { onAddNodeCallback },
      };

      setEdges(eds => [
        ...eds.filter(e => e.id !== edgeId),
        newEdge1,
        newEdge2
      ]);
    } else {
      // Free edge - just connect the new node to source
      const newEdge: Edge = {
        id: generateId(),
        source: edge.source,
        target: newNodeId,
        type: "customEdge",
        data: { onAddNodeCallback },
      };

      setEdges(eds => [
        ...eds.filter(e => e.id !== edgeId),
        newEdge
      ]);
    }

    // Add new node
    setNodes(nds => [...nds, newNode]);
  }, [nodes, edges]);

  // --- Node & edge changes ---
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

  // --- Auto add start node ---
  useEffect(() => {
    if (!nodes.find((n) => n.type === "startNode")) {
      const startNode: Node<BaseNodeData> = {
        id: generateId(),
        type: "startNode",
        position: { x: 300, y: 100 },
        data: {
          onDelete: (id: string) =>
            setNodes((curr) => curr.filter((n) => n.id !== id)),
          onAddNodeCallback: onAddNodeCallback,
        },
      };
      setNodes([startNode]);
    }
  }, [nodes, onAddNodeCallback]);

  // --- Node creation ---
  const createNode = useCallback((type: NodeTypeKey, position: XYPosition): Node<BaseNodeData> => {
    const id = generateId();
    const baseData: BaseNodeData = {
      onDelete: (deleteId: string) => {
        setEdges((currEdges) => {
          const incomingEdges = currEdges.filter(e => e.target === deleteId);
          const outgoingEdges = currEdges.filter(e => e.source === deleteId);

          const newEdges: Edge[] = [];

          // Reconnect all incoming to all outgoing edges
          incomingEdges.forEach(inc => {
            outgoingEdges.forEach(out => {
              newEdges.push({
                id: crypto.randomUUID(),
                source: inc.source,
                target: out.target,
                type: "customEdge",
                data: { onAddNodeCallback },
              });
            });
          });

          // Keep all edges except ones connected to the deleted node
          return [
            ...currEdges.filter(e => e.source !== deleteId && e.target !== deleteId),
            ...newEdges
          ];
        });

        setNodes((currNodes) => currNodes.filter(n => n.id !== deleteId));
      },
      onDataChange: (updatedData: Record<string, unknown>) => {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...updatedData } } : n
          )
        );
      },
      onAddNodeCallback: onAddNodeCallback,
    };
    return { id, type, position, data: baseData };
  }, [onAddNodeCallback]);

  // --- Drag & drop ---
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
    },
    [screenToFlowPosition, createNode]
  );

  // --- Connect nodes ---
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

  // --- Node drag overlap highlight ---
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

  const { isDarkBg } = useChatbotDarkBgStore();

  // --- Auto layout with dagre ---
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

  // --- Add callback to ALL edges ---
  const edgesWithCallback: Edge[] = edges.map(edge => ({
    ...edge,
    data: {
      ...edge.data,
      onAddNodeCallback: onAddNodeCallback
    }
  }));

  return (
    <div className="flex w-full h-screen bg-gray-50 text-gray-900 relative">
      <div className="flex-1 bg-white">
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edgesWithCallback}
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
          className="intersection-flow"
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