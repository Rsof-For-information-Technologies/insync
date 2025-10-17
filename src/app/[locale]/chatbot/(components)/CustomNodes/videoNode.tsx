"use client";
import { Position, Edge } from "@xyflow/react";
import { Plus, Trash2, Video } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
// import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import EdgeAddButton from "../CustomEdges/addEdgeButton";

interface VideoNodeProps {
  id: string;
  data: {
    src?: string;
    edges?: Edge[];
    onDelete: (id: string) => void;
    onAddNodeCallback?: (params: { id: string; type: string }) => void;
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
  const { isTopConnected, isBottomConnected } = useMemo(() => {
    const edges = data.edges || [];
    return {
      isTopConnected: edges.some((e) => e.target === id),
      isBottomConnected: edges.some((e) => e.source === id),
    };
  }, [data.edges, id]);

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
      {/* Top Handle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <CustomHandle type="target" position={Position.Top} id={`${id}-top`} connectionCount={1}/>
          {!isTopConnected && data.onAddNodeCallback && (
            <div className="absolute left-[24px] top-1/2 -translate-y-1/2">
              <EdgeAddButton
                id={`${id}-top`}
                data={{
                  onAddNodeCallback: data.onAddNodeCallback,
                  isHandle: true,
                  nodeId: id,
                  handleType: "target",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Handle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <div className="relative">
          <CustomHandle type="source" position={Position.Bottom} id={`${id}-bottom`} connectionCount={1} />
          {!isBottomConnected && data.onAddNodeCallback && (
            <div className="absolute left-[24px] top-1/2 -translate-y-1/2">
              <EdgeAddButton
                id={`${id}-bottom`}
                data={{
                  onAddNodeCallback: data.onAddNodeCallback,
                  isHandle: true,
                  nodeId: id,
                  handleType: "source",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
