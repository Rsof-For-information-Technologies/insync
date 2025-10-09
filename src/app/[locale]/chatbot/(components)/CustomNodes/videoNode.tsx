"use client";
import { Trash2, Video, Plus } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";
// import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "sonner";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";

interface VideoNodeProps {
  id: string;
  data: {
    src?: string;
    onDelete: (id: string) => void;
    onDataChange?: (data: { selectedVideo: string | null }) => void;
  };
}

const videoValidationSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type.startsWith("video/"), {
    message: "The file format is not supported.",
  }),
});

export default function VideoNode({ id, data }: VideoNodeProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(data.src || null);
  //   const t = useTranslations("Chatbot");

  useEffect(() => {
    if (data.onDataChange) {
      data.onDataChange({ selectedVideo });
    }
  }, [selectedVideo]);

  const validateVideoFile = (file: File) => {
    try {
      videoValidationSchema.parse({ file });
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: "An unexpected error occurred" };
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = validateVideoFile(file);
    if (!result.isValid) {
      toast.error(result.error || "Invalid file");
      e.target.value = "";
      return;
    }

    const newUrl = URL.createObjectURL(file);
    setSelectedVideo(newUrl);
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
          {/* Video display */}
          <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
            {selectedVideo ? (
              <video
                src={selectedVideo}
                className="w-full h-full object-contain"
                controls
              />
            ) : (
              <Video className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* Upload button (icon only) */}
          <label className="flex-shrink-0 self-stretch flex items-center justify-center">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
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
        position={Position.Left}
        id={`${id}-a`}
      />
      <CustomHandle
        type="source"
        position={Position.Right}
        id={`${id}-b`}
      />

    </div>
  );
}
