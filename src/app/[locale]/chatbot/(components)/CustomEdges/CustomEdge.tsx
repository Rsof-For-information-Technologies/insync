"use client";

import { ShadCnButton } from '@/components/shadCn/ui/button';
import cn from '@/utils/class-names';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react';
import { RxCross2 } from 'react-icons/rx';

const CustomEdge = ({ id, data, ...props }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath(props);
    const { deleteElements } = useReactFlow();

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <ShadCnButton
                    variant="ghost"
                    size="icon"
                    aria-label="Delete Edge"
                    className={cn("absolute text-red-500 hover:text-red-600 hover:bg-red-50 transition duration-200 rounded-full")}
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    }}
                    onClick={() => {
                        console.log("Deleting edge with id:", id);
                        deleteElements({ edges: [{ id }] })
                    }}
                >
                    <RxCross2 className="w-4 h-4" />
                </ShadCnButton>
            </EdgeLabelRenderer>
        </>
    );
};

export default CustomEdge;
