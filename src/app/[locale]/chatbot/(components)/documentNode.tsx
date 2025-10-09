"use client";
import { Trash2, FileCode, Download, Plus } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { useState, useEffect } from "react";
// import { useTranslations } from "next-intl";
import { z, ZodError } from "zod";
import { toast } from "sonner";

interface DocumentNodeProps {
  id: string;
  data: {
    onDelete: (id: string) => void;
    onDataChange?: (data: { file: File | null; url: string | null }) => void;
    file?: File | null;
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

      {/* Handles - black */}
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-t`}
        className="!bg-black w-3 h-3 border-2 border-white rounded-full shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-b`}
        className="!bg-black w-3 h-3 border-2 border-white rounded-full shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-a`}
        className="!bg-black w-3 h-3 border-2 border-white rounded-full shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Left}
        id={`${id}-c`}
        className="!bg-black w-3 h-3 border-2 border-white rounded-full shadow-sm"
      />
    </div>
  );
}
