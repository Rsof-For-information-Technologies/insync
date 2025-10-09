"use client";

import { useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Trash2, Bold, Italic, Smile } from "lucide-react";
import { createPortal } from "react-dom";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Switch, Input } from 'rizzui';
import { Select } from 'rizzui';
import { useTranslations } from "next-intl";
import { z, ZodError } from "zod";
import { toast } from "sonner";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";


type MediaOption = {
  label: string;
  value: string;
};

interface TextNodeProps {
  id: string;
  data: {
    label?: string;
    onChange?: (val: string) => void;
    onDelete: (id: string) => void;
    onDataChange?: (updatedData: Record<string, unknown>) => void; // <--- new
  };
}

const textValidationSchema = z.object({
  text: z.string().max(4096, "Text cannot exceed 4096 characters"),
  variableValue: z.string().max(20, "Variable cannot exceed 20 characters").optional(),
});

export default function TextNode({ id, data }: TextNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [acceptMedia, setAcceptMedia] = useState(false);
  const [selectedMediaOption, setSelectedMediaOption] = useState<MediaOption | null>(null);
  const [variableValue, setVariableValue] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const t = useTranslations("Chatbot");

  const paginationLimitOptions = [
    { label: 'Image', value: 'image' },
    { label: 'Document', value: 'document' },
    { label: 'Audio', value: 'audio' },
    { label: 'Video', value: 'video' },
    { label: 'Location', value: 'location' },
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    data.onDataChange?.({
      text,
      acceptMedia,
      selectedMediaOption,
      variableValue,
    });
  }, [text, acceptMedia, selectedMediaOption, variableValue]);

  useEffect(() => {
    const validateText = () => {
      try {
        textValidationSchema.parse({ text, variableValue });
        setIsSaveDisabled(false);
      } catch (error) {
        setIsSaveDisabled(true);
        console.log(error)
        if (error instanceof ZodError) {
          const firstError = error.errors[0].message;
          console.log(firstError)
          if (firstError) {
            toast.error(firstError);
          }
        }
      }
    };
    validateText();
  }, [text, variableValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFormat = (format: "bold" | "italic") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.slice(start, end);

    let formatted = selected;
    if (format === "bold") formatted = `**${selected}**`;
    if (format === "italic") formatted = `*${selected}*`;

    const newText = text.slice(0, start) + formatted + text.slice(end);
    setText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formatted.length);
    }, 0);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText(prev => prev + emojiData.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
  };

  const handleSave = () => {
    setDisplayText(text);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative group flex flex-col items-center">
        {/* Delete button - outside the node, no bg/border */}
        <button
          onClick={() => data.onDelete(id)}
          className="absolute -top-4 right-[-14px] text-gray-400 hover:text-red-500 transition z-10"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Node container - long rectangle with vertical accent */}
        <div
          className="w-[350px] min-h-[60px] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-none flex"
          onClick={() => setIsModalOpen(true)}
        >
          {/* Vertical accent */}
          <div className="w-1 bg-black"></div>

          {/* Content - full height clickable */}
          <div className="flex-1 p-3 text-sm text-gray-800 cursor-pointer leading-relaxed">
            {displayText ? (
              <div
                className="text-[13px]"
                dangerouslySetInnerHTML={{
                  __html: displayText
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
              />
            ) : (
              <span className="text-gray-400 italic">Click to edit</span>
            )}
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


      {/* === Modal (unchanged) === */}
      {isModalOpen &&
        createPortal(
          <>
            <div className="fixed inset-0 bg-black/50 z-[90]" />
            <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[100] flex flex-col animate-slide-left">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{t("setQuestion")}</h2>
                <button onClick={handleCancel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-600 hover:text-gray-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <label className="block text-sm font-medium text-gray-700">
                  {t("textQuestion")}{" "}
                  <i className="text-gray-500">{t("questionChar")}</i>
                </label>

                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 min-h-[120px] text-sm focus:ring focus:ring-yellow-400 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <button
                    ref={emojiButtonRef}
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100"
                    onClick={toggleEmojiPicker}
                  >
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => applyFormat("bold")}
                  >
                    <Bold className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => applyFormat("italic")}
                  >
                    <Italic className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="text-sm text-gray-500 text-right border-b border-gray-200 pb-3">
                  {text.length}/4096
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t("mediaResponse")}
                    </label>
                    <Switch
                      variant="outline"
                      checked={acceptMedia}
                      onChange={(e) =>
                        e.target.checked
                          ? setAcceptMedia(true)
                          : setAcceptMedia(false)
                      }
                    />
                  </div>

                  {acceptMedia && (
                    <div className="mt-3">
                      <Select
                        label="Select media type"
                        options={paginationLimitOptions}
                        value={selectedMediaOption}
                        onChange={setSelectedMediaOption}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-sm mb-2 font-medium text-gray-800">
                    {t("variableHeading")}{" "}
                    <i className="text-gray-500">{t("variableChar")}</i>
                  </p>
                  <Input
                    type="text"
                    size="lg"
                    placeholder="Enter variable (optional)"
                    value={variableValue}
                    onChange={(e) => setVariableValue(e.target.value)}
                  />
                  <div className="text-right text-xs text-gray-500">
                    {variableValue.length}/20
                  </div>
                </div>

                {showEmojiPicker && emojiButtonRef.current && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute z-[9999] top-24 left-6 shadow-xl"
                  >
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="bg-white text-gray-700 border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  {t("cancelModal")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                  className={`px-4 py-2 rounded-lg transition ${isSaveDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                >
                  {t("saveModal")}
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
