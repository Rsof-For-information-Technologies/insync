"use client";
import { Position, Edge } from "@xyflow/react";
import { useEffect, useState, useMemo } from "react";
import { Download, FileCode, Plus, Trash2 } from "lucide-react";
// import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z, ZodError } from "zod";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";
import EdgeAddButton from "../CustomEdges/addEdgeButton";

interface DocumentNodeProps {
  id: string;
  data: {
    src?: string;
    edges?: Edge[];
    onDelete: (id: string) => void;
    onDataChange?: (data: { file: File | null; url: string | null }) => void;
    file?: File | null;
    onAddNodeCallback?: (params: { id: string; type: string; nodeId?: string; handleType?: "source" | "target"; isHandle?: boolean }) => void;

  };
}

const documentValidationSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => !file.type.startsWith("image/"), { message: "Images are not allowed." })
    .refine((file) => !file.type.startsWith("video/"), { message: "Videos are not allowed." })
    .refine((file) => !file.type.startsWith("audio/"), { message: "Audio files are not allowed." }),
});

export default function DocumentNode({ id, data }: DocumentNodeProps) {
  //   const t = useTranslations("Chatbot");
  const [selectedFile, setSelectedFile] = useState<File | null>(data.file || null);
  const [fileURL, setFileURL] = useState<string | null>(
    data.file ? URL.createObjectURL(data.file) : null
  );

  useEffect(() => {
    if (data.onDataChange) {
      data.onDataChange({ file: selectedFile, url: fileURL });
    }
  }, [selectedFile, fileURL]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    try {
      documentValidationSchema.parse({ file });
      setSelectedFile(file);
      setFileURL(URL.createObjectURL(file));
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Unexpected error occurred");
      }
      e.target.value = "";
    }
  };

  const { isTopHandleConnected, isBottomHandleConnected } = useMemo(() => {
    const edgesState = data.edges || [];

    return {
      isTopHandleConnected: edgesState.some((e) => e.target === id),
      isBottomHandleConnected: edgesState.some((e) => e.source === id),
    };
  }, [data.edges, id]);

  const isPreviewable = selectedFile?.type === "application/pdf";

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
      <div className="w-[350px] min-h-[100px] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-none flex cursor-pointer">
        {/* Vertical accent */}
        <div className="w-1 bg-black"></div>

        {/* Content area */}
        <div className="flex-1 flex items-center p-3 gap-3">
          <div className="flex-1 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
            {fileURL ? (
              isPreviewable ? (
                <iframe src={fileURL} className="w-full h-[150px]" />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 gap-2">
                  <FileCode className="w-10 h-10 text-gray-500" />
                  <p className="text-xs text-gray-600 truncate max-w-[150px] text-center">
                    {selectedFile?.name}
                  </p>
                  <a
                    href={fileURL}
                    download={selectedFile?.name}
                    className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-700"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              )
            ) : (
              <FileCode className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* Upload button (side icon) */}
          <label className="flex-shrink-0 self-stretch flex items-center justify-center">
            <input type="file" accept="*/*" className="hidden" onChange={handleFileUpload} />
            <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-md cursor-pointer">
              <Plus className="w-5 h-5" />
            </div>
          </label>
        </div>
      </div>

      {/* Top Handle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <CustomHandle type="target" position={Position.Top} id={`${id}-top`} connectionCount={1} />
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
