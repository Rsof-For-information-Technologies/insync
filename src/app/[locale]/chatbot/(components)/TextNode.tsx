"use client";

import { useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Trash2, X, Bold, Italic, Smile } from "lucide-react";
import { createPortal } from "react-dom";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Switch, Input } from 'rizzui';
import { Select } from 'rizzui';
import { useTranslations } from "next-intl";

type MediaOption = {
  label: string;
  value: string;
};

interface TextNodeProps {
  id: string;
  data: { label: string; onChange: (val: string) => void; onDelete: (id: string) => void };
}

export default function TextNode({ id, data }: TextNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState(""); // <-- For showing in lower div
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [acceptMedia, setAcceptMedia] = useState(false);
  const [selectedMediaOption, setSelectedMediaOption] = useState<MediaOption | null>(null);
  const [variableValue, setVariableValue] = useState("");
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


  // Close emoji picker on outside click
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
      <div className="w-[250px] rounded-lg bg-white text-sm relative">
        <div className="flex items-center justify-between p-2.5 bg-yellow-600 text-white rounded-t-lg">
          <h3 className="text-[14px] font-normal m-0 text-white"> {t("textNodeHeading")} </h3>
          <button onClick={() => data.onDelete(id)}>
            <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-300" />
          </button>
        </div>

        {/* Lower div now shows saved text */}
        <div
          className="p-2.5 min-h-[60px] bg-white border-l border-r border-b border-gray-400 rounded-b-lg cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {displayText ? (
            <span
              className="break-words"
              dangerouslySetInnerHTML={{
                __html: displayText
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>'),
              }}
            />
          ) : (
            <span className="text-gray-400"></span>
          )}
        </div>
        <Handle type="target" position={Position.Top} id={`${id}-t`} />
        <Handle type="source" position={Position.Bottom} id={`${id}-b`} />
        <Handle type="source" position={Position.Right} id={`${id}-a`} />
        <Handle type="source" position={Position.Left} id={`${id}-c`} />
      </div>

      {isModalOpen &&
        createPortal(
          <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-[100] transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-300">
              <h2 className="text-[23px] font-bold"> {t("setQuestion")} </h2>
              <X
                className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-900"
                onClick={handleCancel}
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 relative">
              <label className="block text-base font-medium text-gray-700">
                {t("textQuestion")} <i className="text-gray-500"> {t("questionChar")} </i>
              </label>

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={4096}
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[120px] focus:ring focus:ring-blue-400 focus:outline-none"
              />

              {/* Toolbar */}
              <div className="flex items-center space-x-3 relative">
                <button
                  ref={emojiButtonRef}
                  type="button"
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={toggleEmojiPicker}
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => applyFormat("bold")}
                >
                  <Bold className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => applyFormat("italic")}
                >
                  <Italic className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="text-sm text-gray-500 text-right mt-1 border-b border-gray-300 pb-4">
                {text.length}/4096 characters
              </div>

              {/* Accept Media Response */}
              <div className="border-b border-gray-300 pb-[16px]">
                <div className="flex items-center justify-between mt-4">
                  <label className="text-base font-medium text-gray-700">{t("mediaResponse")}</label>
                  <Switch
                    variant="outline"
                    checked={acceptMedia}
                    onChange={(e) =>
                      e.target.checked ? setAcceptMedia(true) : setAcceptMedia(false)
                    }
                  />
                </div>
                {/* Media type select if switch is active */}
                {acceptMedia && (
                  <div className="mt-2">
                    <Select
                      label="Select media type"
                      options={paginationLimitOptions}
                      value={selectedMediaOption}
                      onChange={setSelectedMediaOption}
                    />
                  </div>
                )}
              </div>

              {/* Variable input */}
              <div className="mt-4 relative">
                <p className="text-base mb-5 font-medium text-black">{t("variableHeading")}  <i className="text-gray-500"> {t("variableChar")} </i></p>
                <Input
                  type="text"
                  size="lg"
                  placeholder="Enter variable value (optional)"
                  value={variableValue}
                  maxLength={20}
                  onChange={(e) => setVariableValue(e.target.value)}
                  className="[&>label>span]:font-medium"
                />
                {/* Character counter */}
                <div className="text-right text-sm text-gray-500">
                  {variableValue.length}/20
                </div>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && emojiButtonRef.current &&
                <div
                  ref={emojiPickerRef}
                  className="absolute z-[9999] top-0 left-[15px] shadow-xl"
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              }
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end p-5 border-t border-gray-300 space-x-3">
              <button
                onClick={handleCancel}
                className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition"
              >
                {t("cancelModal")}
              </button>
              <button
                onClick={handleSave}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                {t("saveModal")}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
