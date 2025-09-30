"use client";
import { Trash2, FileCode } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface DocumentNodeProps {
    id: string;
    data: { onDelete: (id: string) => void };
}

export default function DocumentNode({ id, data }: DocumentNodeProps) {
    const t = useTranslations("Chatbot");
    const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedDocument(file);
    }
    return (
        <div className="w-[220px] rounded-[10px] overflow-hidden border border-gray-300 bg-gray-100 shadow">
            {/* Header */}
            <div className="flex items-center justify-between p-2.5 bg-purple-600 text-white">
                <h3 className="text-[14px] text-white font-medium"> {t("addDoc")}</h3>
                <Trash2
                    className="w-4 h-4 cursor-pointer hover:text-red-300"
                    onClick={() => data.onDelete(id)}
                />
            </div>

            {/* Content area */}
            <div className="bg-white border-t border-gray-300 rounded-b-[10px] p-2 flex flex-col items-center">
                {/* document preview */}
                <div className="w-full flex items-center justify-center border border-gray-300 rounded-md bg-gray-50 mb-2">
                    {selectedDocument ? (
                        <div className="w-full h-[300px] overflow-y-auto">
                            <iframe
                                src={URL.createObjectURL(selectedDocument)}
                                className="w-full h-full"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-[100px]">
                            <FileCode className="w-10 h-10 text-gray-400" />
                        </div>
                    )}
                </div>
                {/* Upload button */}
                <label className="w-full">
                    <input
                        type="file"
                        accept="*/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <span className="block w-full text-center bg-blue-600 text-white py-2 rounded-md cursor-pointer hover:bg-blue-700">
                        {t("chooseDoc")}
                    </span>
                </label>
            </div>
            <Handle type="target" position={Position.Top} id={`${id}-t`} />
            <Handle type="source" position={Position.Bottom} id={`${id}-b`} />
            <Handle type="source" position={Position.Right} id={`${id}-a`} />
            <Handle type="source" position={Position.Left} id={`${id}-c`} />
        </div>
    );
}
