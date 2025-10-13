"use client";
import { Position } from "@xyflow/react";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
// import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";

interface ImageNodeProps {
    id: string;
    data: {
        src: string;
        onDelete: (id: string) => void;
        onDataChange?: (data: { selectedImage: string | null }) => void;
    };
}

const imageValidationSchema = z.object({
    file: z.instanceof(File)
        .refine((file) => file.type.startsWith('image/'), {
            message: "The file format is not supported."
        })
});

export default function ImageNode({ id, data }: ImageNodeProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(data.src || null);
    // const t = useTranslations("Chatbot");

    useEffect(() => {
        if (data.onDataChange) {
            data.onDataChange({ selectedImage });
        }
    }, [selectedImage]);

    const validateImageFile = (file: File) => {
        try {
            imageValidationSchema.parse({ file });
            return { isValid: true };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { isValid: false, error: error.errors[0].message };
            }
            return { isValid: false, error: "An unexpected error occurred" };
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = validateImageFile(file);
        if (!result.isValid) {
            toast.error(result.error || "Invalid file");
            e.target.value = "";
            return;
        }

        const newUrl = URL.createObjectURL(file);
        setSelectedImage(newUrl);
    };

    return (
        <div className="relative group flex flex-col items-center">
            {/* Delete button */}
            <button
                onClick={() => data.onDelete(id)}
                className="absolute -top-4 right-[-14px] text-gray-400 hover:text-red-500 transition z-10"
                title="Delete Node"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Node container */}
            <div
                className="w-[350px] min-h-[100px] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-none flex cursor-pointer"
                onClick={() => { }}
            >
                {/* Vertical accent */}
                <div className="w-1 bg-black"></div>

                {/* Content */}
                <div className="flex-1 flex items-center p-3 gap-3">
                    {/* Image display */}
                    <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 h-[80px]">
                        {selectedImage ? (
                            <img src={selectedImage} alt="uploaded" className="w-full h-full object-contain" />
                        ) : (
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                        )}
                    </div>

                    {/* Upload button */}
                    <label className="flex-shrink-0">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-md cursor-pointer">
                            <Plus className="w-5 h-5" />
                        </div>
                    </label>
                </div>
            </div>

            {/* Handles */}
            <CustomHandle
                type="target"
                position={Position.Top}
                id={`${id}-a`}
            />
            <CustomHandle
                type="source"
                position={Position.Bottom}
                id={`${id}-b`}
            />
        </div>

    );
}
