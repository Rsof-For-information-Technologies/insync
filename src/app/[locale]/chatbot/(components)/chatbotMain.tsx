"use client";

import { useState, useCallback } from "react";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Background,
    Controls,
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    useReactFlow,
    MiniMap
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTranslations } from "next-intl";
import TextNode from "./TextNode";
import ImageNode from "./ImageNode";
import VideoNode from "./videoNode";
import DocumentNode from "./documentNode";
import AudioNode from "./audioNode";

const nodeTypes = { textNode: TextNode, imageNode: ImageNode, videoNode: VideoNode, documentNode: DocumentNode, audioNode: AudioNode };

export default function ChatbotMain() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const t = useTranslations("Chatbot");
    const { toObject } = useReactFlow();

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params }, eds)),
        []
    );

    const generateId = () => {
        return crypto.randomUUID();
    }

    const addTextNode = () => {
        const id = generateId();
        setNodes((nds) => [
            ...nds,
            {
                id,
                type: "textNode",
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: {
                    onDelete: (deleteId: string) => {
                        setNodes((curr) => curr.filter((n) => n.id !== deleteId));
                        setEdges((curr) =>
                            curr.filter((e) => e.source !== deleteId && e.target !== deleteId)
                        );
                    },
                },
            },
        ]);
    };

    const addImageNode = () => {
        const id = generateId();
        setNodes((nds) => [
            ...nds,
            {
                id,
                type: "imageNode",
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: {
                    src: "https://via.placeholder.com/150", // placeholder image
                    onDelete: (deleteId: string) => {
                        setNodes((curr) => curr.filter((n) => n.id !== deleteId));
                        setEdges((curr) =>
                            curr.filter((e) => e.source !== deleteId && e.target !== deleteId)
                        );
                    },
                    onChange: (newSrc: string) => {
                        setNodes((nds) =>
                            nds.map((n) =>
                                n.id === id ? { ...n, data: { ...n.data, src: newSrc } } : n
                            )
                        );
                    },
                },
            },
        ]);
    };

    const addVideoNode = () => {
        const id = generateId();
        setNodes((nds) => [
            ...nds,
            {
                id,
                type: "videoNode",
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: {
                    onDelete: (deleteId: string) => {
                        setNodes((curr) => curr.filter((n) => n.id !== deleteId));
                        setEdges((curr) =>
                            curr.filter((e) => e.source !== deleteId && e.target !== deleteId)
                        );
                    },
                },
            },
        ]);
    };

    const addDocumentNode = () => {
        const id = generateId();
        setNodes((nds) => [
            ...nds,
            {
                id,
                type: "documentNode",
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: {
                    onDelete: (deleteId: string) => {
                        setNodes((curr) => curr.filter((n) => n.id !== deleteId));
                        setEdges((curr) =>
                            curr.filter((e) => e.source !== deleteId && e.target !== deleteId)
                        );
                    },
                },
            },
        ]);
    };

    const addAudioNode = () => {
        const id = generateId();
        setNodes((nds) => [
            ...nds,
            {
                id,
                type: "audioNode",
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: {
                    onDelete: (deleteId: string) => {
                        setNodes((curr) => curr.filter((n) => n.id !== deleteId));
                        setEdges((curr) =>
                            curr.filter((e) => e.source !== deleteId && e.target !== deleteId)
                        );
                    },
                },
            },
        ]);
    };

    const saveFlow = () => {
        const flow = toObject();
        console.log("Flow data:", flow);
    };

    return (
        <div className="flex w-full h-screen bg-white">
            {/* Sidebar */}
            <div className="w-[200px] pt-5 pl-7 pb-5 pr-[10px] border-r border-gray-500 bg-gray-100">
                <h3 className="mb-5">{t("nodeTitle")}</h3>
                <button
                    onClick={addTextNode}
                    className="w-full bg-blue-700 text-white font-semibold p-[10px] rounded-lg"
                >
                    {t("nodeName")}
                </button>
                <button
                    onClick={addImageNode}
                    className="w-full bg-green-600 mt-[10px] text-white font-semibold p-[10px] rounded-lg"
                >
                    {t("imageNode")}
                </button>
                <button
                    onClick={addVideoNode}
                    className="w-full bg-yellow-600 mt-[10px] text-white font-semibold p-[10px] rounded-lg"
                >
                    {t("videoNode")}
                </button>
                <button
                    onClick={addDocumentNode}
                    className="w-full bg-purple-600 mt-[10px] text-white font-semibold p-[10px] rounded-lg"
                >
                    {t("documentNode")}
                </button>
                <button
                    onClick={addAudioNode}
                    className="w-full bg-pink-600 mt-[10px] text-white font-semibold p-[10px] rounded-lg"
                >
                    {t("audioNode")}
                </button>
                <h3 className="mt-20 mb-5">{t("actionTitle")}</h3>
                <button
                    onClick={saveFlow}
                    className="w-full bg-gray-800 mt-[10px] text-white font-semibold p-[10px] rounded-lg"
                >
                    Save Flow
                </button>
            </div>

            {/* Flow canvas */}
            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <MiniMap
                        nodeStrokeWidth={3}
                        zoomable
                        pannable
                        nodeColor={(node) => {
                            switch (node.type) {
                                case "textNode":
                                    return "blue";
                                case "imageNode":
                                    return "green";
                                case "videoNode":
                                    return "yellow";
                                case "documentNode":
                                    return "purple";
                                default:
                                    return "#eee";
                            }
                        }}
                    />
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}
