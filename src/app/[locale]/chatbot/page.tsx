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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTranslations } from "next-intl";
import TextNode from "./(components)/TextNode";

const nodeTypes = { textNode: TextNode };


export default function Page() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const t = useTranslations('Chatbot');

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect: OnConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge({ ...params, style: { fontSize: 14 } }, eds)
            ),
        []
    );

    const addTextNode = () => {
        const id = `${+new Date()}`;
        setNodes((nds) => [
            ...nds,
            {
                id,
                type: "textNode",
                position: { x: Math.random() * 300, y: Math.random() * 300 },
                data: {
                    label: "New Node",
                    onChange: (val: string) =>
                        setNodes((curr) =>
                            curr.map((n) =>
                                n.id === id ? { ...n, data: { ...n.data, label: val } } : n
                            )
                        ),
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

    return (
        <div className="flex w-full h-screen bg-white">
            {/* Sidebar */}
            <div className="w-[200px] pt-5 pl-7 pb-5 pr-[10px] border-r border-gray-500 bg-gray-100">
                <h3 className="mb-5">{t('nodeTitle')}</h3>
                <button
                    onClick={addTextNode}
                    className="w-full bg-blue-700 text-white font-semibold p-[10px] rounded-lg"
                >
                    {t('nodeName')}
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
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}
