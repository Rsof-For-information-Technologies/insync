"use client"

import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import FlowEditor from './FlowEditor'

function Editor({ workFlow }: { workFlow: React.ReactNode }) {
    return (
        <ReactFlowProvider>
            <div className='flex flex-col h-full w-full overflow-hidden'>
                <section className='flex h-full overflow-auto'>
                    <FlowEditor workFlow={workFlow} />
                </section>
            </div>
        </ReactFlowProvider>
    )
}

export default Editor