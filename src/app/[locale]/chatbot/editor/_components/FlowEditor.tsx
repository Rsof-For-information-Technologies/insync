"use client"

import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import React from 'react'
import '@xyflow/react/dist/style.css'

function FlowEditor({ workFlow }: { workFlow: React.ReactNode }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    return (
        <main className='h-full w-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
            >
                <Controls position='bottom-left' />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <MiniMap position='bottom-right' />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor