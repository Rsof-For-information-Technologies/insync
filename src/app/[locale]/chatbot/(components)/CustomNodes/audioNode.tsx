"use client";
import { Position } from "@xyflow/react";
import { FileAudio, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z, ZodError } from "zod";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";

interface AudioNodeProps {
  id: string;
  data: { onDelete: (id: string) => void };
}

const audioValidationSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type.startsWith("audio/"), {
    message: "Only audio files are allowed."
  })
});

export default function AudioNode({ id, data }: AudioNodeProps) {
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

  function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      try {
        audioValidationSchema.parse({ file });
        setSelectedAudio(URL.createObjectURL(file));
      } catch (error) {
        if (error instanceof ZodError) {
          toast.error(error.errors[0].message);
          e.target.value = "";
        }
      }
    } else {
      setSelectedAudio(null);
    }
  }

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

      {/* Node container with vertical accent */}
      <div className="w-[350px] min-h-[90px] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-none flex items-center gap-3 relative">

        {/* Left accent line */}
        <div className="absolute top-0 left-0 h-full w-[6px] bg-black"></div>

        {/* Content padding wrapper to avoid overlapping the accent */}
        <div className="pl-4 pr-3 py-3 flex w-full items-center justify-between gap-3">
          {/* Audio Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm min-h-[70px]">
            {selectedAudio ? (
              <audio src={selectedAudio} className="w-full" controls />
            ) : (
              <FileAudio className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Upload Button - side */}
          <label className="flex-shrink-0">
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />
            <span className="px-4 py-2 text-sm bg-black text-white rounded-sm cursor-pointer hover:bg-gray-800 transition">
              Upload
            </span>
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
