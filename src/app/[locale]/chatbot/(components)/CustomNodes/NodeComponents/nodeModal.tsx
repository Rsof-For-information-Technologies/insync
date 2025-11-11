"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Bold, Italic, Smile } from "lucide-react";
import { Input, Select, Switch } from "rizzui";
import { toast } from "sonner";
import { z, ZodError } from "zod";
import { useTranslations } from "next-intl";

type MediaOption = {
  label: string;
  value: string;
};

interface NodeModalProps {
  isOpen: boolean;
  text: string;
  variables?: { name: string; type: string }[];
  acceptMedia: boolean;
  selectedMediaOption: MediaOption | null;
  onClose: () => void;
  onSave: (payload: {
    text: string;
    variables: { name: string; type: string }[];
    acceptMedia: boolean;
    selectedMediaOption: MediaOption | null;
  }) => void;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setvariables: React.Dispatch<React.SetStateAction<{ name: string; type: string }[]>>;
  setAcceptMedia: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMediaOption: React.Dispatch<React.SetStateAction<MediaOption | null>>;
}

// ✅ Zod schema for validation (runs only on Save)
const textValidationSchema = z.object({
  text: z
    .string()
    .max(4096, "Text cannot exceed 4096 characters")
    .nonempty("Text is required"),
  variables: z
    .array(z.object({
      name: z.string().max(20, "Variable name cannot exceed 20 characters"),
      type: z.string(),
    }))
    .optional(),
});

export default function NodeModal({
  isOpen,
  text,
  variables = [],
  acceptMedia,
  selectedMediaOption,
  onClose,
  onSave,
  setText,
  setvariables,
  setAcceptMedia,
  setSelectedMediaOption,
}: NodeModalProps) {
  const t = useTranslations("Chatbot");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const mediaOptions: MediaOption[] = [
    { label: "Image", value: "image" },
    { label: "Document", value: "document" },
    { label: "Audio", value: "audio" },
    { label: "Video", value: "video" },
    { label: "Location", value: "location" },
  ];

  // 🧠 Handle Emoji click
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // 🧠 Apply text formatting (bold/italic)
  const applyFormat = (format: "bold" | "italic") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selected = text.slice(start, end);

    let formatted = selected;
    if (format === "bold") formatted = `**${selected}**`;
    if (format === "italic") formatted = `*${selected}*`;

    setText((prev) => prev.slice(0, start) + formatted + prev.slice(end));

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, start + formatted.length);
    }, 0);
  };

  // 🧠 Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Validation only on Save
  const handleSaveClick = () => {
    setIsSaveDisabled(true);
    try {
      textValidationSchema.parse({ text, variables });
      onSave({ text, variables, acceptMedia, selectedMediaOption });
      toast.success("Saved successfully!");
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0]?.message;
        toast.error(firstError || "Validation failed");
      } else {
        toast.error("Unknown validation error");
      }
    }
  };

  // Enable save button again when user types
  useEffect(() => {
    setIsSaveDisabled(false);
  }, [text, variables]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-[90]" />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-[100] flex flex-col animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{t("setQuestion")}</h2>
          <button onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600 hover:text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Text input */}
          <label className="block text-sm font-medium text-gray-700">
            {t("textQuestion")} <i className="text-gray-500">{t("questionChar")}</i>
          </label>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setIsSaveDisabled(false)
            }}
            className="w-full border border-gray-300 rounded-lg p-2.5 min-h-[120px] text-sm focus:ring focus:ring-yellow-400 focus:outline-none"
          />

          {/* Formatting + emoji */}
          <div className="flex items-center gap-2">
            <button
              ref={emojiButtonRef}
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
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

          {/* Media */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{t("mediaResponse")}</label>
              <Switch
                variant="outline"
                checked={acceptMedia}
                onChange={(e) => { setAcceptMedia(e.target.checked); setIsSaveDisabled(false) }}
              />
            </div>

            {acceptMedia && (
              <div className="mt-3">
                <Select
                  label="Select media type"
                  options={mediaOptions}
                  value={selectedMediaOption}
                  onChange={(value) =>
                    setSelectedMediaOption(value as MediaOption | null)
                  }
                />
              </div>
            )}
          </div>

          {/* Variables */}
          <div className="mt-3">
            <p className="text-sm mb-2 font-medium text-gray-800">
              {t("variableHeading")} <i className="text-gray-500">{t("variableChar")}</i>
            </p>
            <Input
              type="text"
              size="lg"
              placeholder="Enter variable (optional)"
              value={variables[0]?.name || ""}
              onChange={(e) =>
                {setvariables([{ name: e.target.value, type: "string" }]); setIsSaveDisabled(false);}
              }
            />
            <div className="text-right text-xs text-gray-500">
              {variables[0]?.name?.length || 0}/20
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

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-white text-gray-700 border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            {t("cancelModal")}
          </button>
          <button
            onClick={handleSaveClick}
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
  );
}
