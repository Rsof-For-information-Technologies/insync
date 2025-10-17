"use client";

import { Position, Edge } from "@xyflow/react";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useState,  useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import EdgeAddButton from "../CustomEdges/addEdgeButton";

interface ImageNodeProps {
    id: string;
    data: {
        src?: string;
        edges?: Edge[];
        onDelete: (id: string) => void;
        onDataChange?: (data: { selectedImage: string | null }) => void;
        onAddNodeCallback?: (params: { id: string; type: string; nodeId?: string; handleType?: "source" | "target"; isHandle?: boolean }) => void;
    };
}


const imageValidationSchema = z.object({
    file: z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "The file format is not supported.",
    }),
});

export default function ImageNode({ id, data }: ImageNodeProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(data.src || null);
  const { isTopHandleConnected, isBottomHandleConnected } = useMemo(() => {
    const edgesState = data.edges || [];

    return {
      isTopHandleConnected: edgesState.some((e) => e.target === id),
      isBottomHandleConnected: edgesState.some((e) => e.source === id),
    };
  }, [data.edges, id]);

    useEffect(() => {
        data.onDataChange?.({ selectedImage });
    }, [selectedImage, data.onDataChange]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            imageValidationSchema.parse({ file });
            setSelectedImage(URL.createObjectURL(file));
        } catch (err) {
            const message = err instanceof z.ZodError ? err.errors[0].message : "Unexpected error";
            toast.error(message);
            e.target.value = "";
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={() => data.onDelete(id)}
                className="absolute -top-4 right-[-14px] text-gray-400 hover:text-red-500 z-10"
                title="Delete Node"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-[350px] min-h-[100px] bg-white border border-gray-200 shadow-sm hover:shadow-md flex cursor-pointer overflow-hidden">
                <div className="w-1 bg-black" />
                <div className="flex-1 flex items-center gap-3 p-3">
                    <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 h-[80px]">
                        {selectedImage ? (
                            <img src={selectedImage} alt="uploaded" className="w-full h-full object-contain" />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <label>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-md cursor-pointer">
                            <Plus className="w-5 h-5" />
                        </div>
                    </label>
                </div>
            </div>

            {/* Top Handle */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <CustomHandle type="target" position={Position.Top} id={`${id}-top`}  connectionCount={1}/>
                    {!isTopHandleConnected && data.onAddNodeCallback && (
                        <div className="absolute left-[24px] top-1/2 transform -translate-y-1/2">
                            <EdgeAddButton
                                id={`${id}-top`}
                                data={{ onAddNodeCallback: data.onAddNodeCallback, nodeId: id, handleType: 'target', isHandle: true }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* Bottom Handle */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                    <CustomHandle type="source" position={Position.Bottom} id={`${id}-bottom`} connectionCount={1} />
                    {!isBottomHandleConnected && data.onAddNodeCallback && (
                        <div className="absolute left-[24px] top-1/2 transform -translate-y-1/2">
                            <EdgeAddButton
                                id={`${id}-bottom`}
                                data={{ onAddNodeCallback: data.onAddNodeCallback, nodeId: id, handleType: 'source', isHandle: true }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
