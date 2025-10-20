"use client";

import { Position } from "@xyflow/react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Bold, Italic, Smile, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Input, Select, Switch } from 'rizzui';
import { toast } from "sonner";
import { z, ZodError } from "zod";
import CustomHandle from "../CustomReactFlowComponents/CustomHandle";

type MediaOption = {
  label: string;
  value: string;
};

interface ButtonNodeProps {
  id: string;
  data: { label: string; onChange: (val: string) => void; onDelete: (id: string) => void };
}

const textValidationSchema = z.object({
  text: z.string().max(4096, "Text cannot exceed 4096 characters"),
  headerVariableValue: z.string().max(60, "Header cannot exceed 60 characters").optional(),
  footerVariableValue: z.string().max(60, "Footer cannot exceed 60 characters").optional(),
  variableValue: z.string().max(20, "Variable cannot exceed 20 characters").optional(),
  buttons: z
    .array(z.string().max(20, "Button name cannot exceed 20 characters"))
    .min(1, "At least one button is required")
    .max(3, "You can only have up to 3 buttons"),
});

export default function ButtonNode({ id, data }: ButtonNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [acceptMedia, setAcceptMedia] = useState(false);
  const [selectedMediaOption, setSelectedMediaOption] = useState<MediaOption | null>(null);
  const [headerVariableValue, setheaderVariableValue] = useState("");
  const [footerVariableValue, setFooterVariableValue] = useState("");
  const [variableValue, setVariableValue] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [buttons, setButtons] = useState<string[]>([""]);
  const t = useTranslations("Chatbot");
  console.log(displayText);

  const paginationLimitOptions = [
    { label: 'Document', value: 'document' },
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' },
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // text validation
  useEffect(() => {
    const validateText = () => {
      try {
        textValidationSchema.parse({
          text,
          headerVariableValue,
          footerVariableValue,
          variableValue,
          buttons,
        });
        setIsSaveDisabled(false);
      } catch (error) {
        setIsSaveDisabled(true);
        if (error instanceof ZodError) {
          const firstError = error.errors[0]?.message;
          if (firstError) toast.error(firstError);
        }
      }
    };
    validateText();
  }, [text, headerVariableValue, footerVariableValue, variableValue, buttons]);

  // Reset file when media type changes
  useEffect(() => {
    setFile(null);
  }, [selectedMediaOption]);

  // Close emoji picker when clicking outside
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

  const handleSave = () => {
    setDisplayText(text);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploadedFile = e.target.files[0];
    if (!selectedMediaOption) return;

    let schema;

    if (selectedMediaOption.value === "document") {
      schema = z.instanceof(File)
        .refine(file => !file.type.startsWith('image/'), { message: "Only document files are allowed" })
        .refine(file => !file.type.startsWith("video/"), { message: "Only document files are allowed" })
        .refine(file => !file.type.startsWith("audio/"), { message: "Only document files are allowed" });
    } else if (selectedMediaOption.value === "video") {
      schema = z.instanceof(File).refine(f => f.type.startsWith("video/"), { message: "Only video files are allowed" });
    } else if (selectedMediaOption.value === "audio") {
      schema = z.instanceof(File).refine(f => f.type.startsWith("audio/"), { message: "Only audio files are allowed" });
    } else {
      schema = z.any();
    }

    try {
      schema.parse(uploadedFile);
      setFile(uploadedFile);
    } catch (err: unknown) {
      setFile(null);
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0]?.message || "Unsupported file format");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Unsupported file format");
      }
    }
  };

  const renderFilePreview = () => {
    if (!file || !selectedMediaOption) return null;
    const url = URL.createObjectURL(file);

    switch (selectedMediaOption.value) {
      case "document":
        return <iframe src={url} className="w-full h-48 border rounded" />;
      case "video":
        return <video src={url} className="w-full h-48" controls />;
      case "image":
        return <img src={url} className="w-full" />;
      default:
        return null;
    }
  };

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

  const handleButtonChange = (index: number, value: string) => {
    const updated = [...buttons];
    updated[index] = value;
    setButtons(updated);
  };

  const addNewButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, ""]);
    } else {
      toast.error("You can only have up to 3 buttons");
    }
  };

  const removeButton = (index: number) => {
    if (buttons.length > 1) {
      setButtons(buttons.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <div className="w-[250px] rounded-lg bg-white text-sm relative">
        <div className="flex items-center justify-between p-2.5 bg-red-500 text-white rounded-t-lg">
          <h3 className="text-[14px] font-normal m-0 text-white"> Button Node </h3>
          <button onClick={() => data.onDelete(id)}>
            <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-300" />
          </button>
        </div>

        <div
          className="p-2.5 min-h-[60px] bg-white border-l border-r border-b border-gray-400 rounded-b-lg cursor-pointer space-y-2"
          onClick={() => setIsModalOpen(true)}
        >
          {/* File Preview */}
          {file && selectedMediaOption && (
            <div className="mt-2">
              {renderFilePreview()}
            </div>
          )}

          {/* Header */}
          {headerVariableValue && (
            <div className="text-sm font-medium text-black">{headerVariableValue}</div>
          )}

          {/* Body */}
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

          {/* Footer */}
          {footerVariableValue && (
            <div className="text-sm font-medium text-gray-700">{footerVariableValue}</div>
          )}

          {/* Variable */}
          {variableValue && (
            <div className="text-xs text-gray-500">{variableValue}</div>
          )}

          {/* Buttons */}
          {buttons.map((btn, index) => (
            btn && (
              <button
                key={index}
                className="inline-block w-full border border-black rounded-md px-2 py-2 text-sm font-medium mr-2 mt-1"
              >
                {btn}
              </button>
            )
          ))}
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

      {isModalOpen &&
        createPortal(
          // overlay
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[90]" />
            <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-[100] transition-all duration-300 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-300">
                <h2 className="text-[23px] font-bold"> Set Buttons </h2>
                <X
                  className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-900"
                  onClick={handleCancel}
                />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Media Response */}
                <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                  <label className="text-base font-medium text-gray-700">Media header</label>
                  <Switch
                    variant="outline"
                    checked={acceptMedia}
                    onChange={(e) => setAcceptMedia(e.target.checked)}
                  />
                </div>

                {/* Show media section only if switch ON */}
                {acceptMedia && (
                  <div className="border-b border-gray-300 pb-4">
                    <div className="mt-2 ">
                      <Select
                        label="Select media type"
                        options={paginationLimitOptions}
                        value={selectedMediaOption}
                        onChange={(value) => setSelectedMediaOption(value as MediaOption | null)}
                      />
                    </div>

                    {selectedMediaOption && (
                      <div className="mt-4 flex flex-col items-center">
                        {/* File Preview */}
                        {file && <div className="mb-2 w-full">{renderFilePreview()}</div>}

                        {/* Upload Button */}
                        <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                          Upload {selectedMediaOption.label}
                          <input
                            type="file"
                            accept={
                              selectedMediaOption.value === "document"
                                ? ".pdf,.doc,.docx,.txt"
                                : selectedMediaOption.value === "video"
                                  ? "video/*"
                                  : selectedMediaOption.value === "audio"
                                    ? "audio/*"
                                    : "*"
                            }
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
                {/* Header input only when media header is OFF */}
                {!acceptMedia && (
                  <div className="mt-4 relative border-b border-gray-300 pb-4">
                    <p className="text-base mb-5 font-medium text-black">
                      Header Text <i className="text-gray-500"> {t("variableChar")} </i>
                    </p>
                    <Input
                      type="text"
                      size="lg"
                      placeholder="Input value"
                      value={headerVariableValue}
                      onChange={(e) => setheaderVariableValue(e.target.value)}
                      className="[&>label>span]:font-medium"
                    />
                    <div className="mt-3 text-right text-sm text-gray-500">
                      {headerVariableValue.length}/60 characters
                    </div>
                  </div>
                )}
                {/* Body Text */}
                <div>
                  <label className="block text-base font-medium text-gray-700 pb-3">
                    Body text <i className="text-gray-500"> {t("questionChar")} </i>
                  </label>

                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
                </div>
                {/* Footer input */}
                <div className="mt-4 relative border-b border-gray-300 pb-4">
                  <p className="text-base mb-5 font-medium text-black">
                    Footer Text <i className="text-gray-500"> {t("variableChar")} </i>
                  </p>
                  <Input
                    type="text"
                    size="lg"
                    placeholder="Input footer text"
                    value={footerVariableValue}
                    onChange={(e) => setFooterVariableValue(e.target.value)}
                    className="[&>label>span]:font-medium"
                  />
                  <div className="mt-3 text-right text-sm text-gray-500">
                    {footerVariableValue.length}/60 characters
                  </div>
                </div>
                {/* Variable Input */}
                <div className="mt-4 relative border-b border-gray-300 pb-4">
                  <p className="text-base mb-5 font-medium text-black">
                    Variable <i className="text-gray-500">{t("variableChar")}</i>
                  </p>
                  <Input
                    type="text"
                    size="lg"
                    placeholder="Input variable text"
                    value={variableValue}
                    onChange={e => setVariableValue(e.target.value)}
                  />
                  <div className="mt-3 text-right text-sm text-gray-500">{variableValue.length}/20 characters</div>
                </div>
                {/* Dynamic Buttons Section */}
                <div className="mt-4 relative border-b border-gray-300 pb-4">
                  <p className="text-base mb-5 font-medium text-black">Buttons</p>

                  {buttons.map((btn, index) => (
                    <div key={index} className="mb-6">
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        Button {index + 1}
                      </span>

                      <Input
                        type="text"
                        size="lg"
                        placeholder="Button Name"
                        value={btn}
                        onChange={(e) => handleButtonChange(index, e.target.value)}
                      />

                      <div className="mt-2 text-right text-sm text-gray-500">
                        {btn.length}/20 characters
                      </div>

                      {buttons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeButton(index)}
                          className="mt-4 w-full border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 transition"
                        >
                          Remove Button
                        </button>
                      )}
                    </div>
                  ))}

                  {buttons.length < 3 && (
                    <button
                      type="button"
                      onClick={addNewButton}
                      className="mt-2 text-blue-600 font-medium hover:underline"
                    >
                      + New Button
                    </button>
                  )}
                </div>
                {/* Emoji Picker */}
                {showEmojiPicker && emojiButtonRef.current && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute z-[9999] top-0 left-[15px] shadow-xl"
                  >
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end p-5 border-t border-gray-300 space-x-3">
                <button
                  onClick={handleCancel}
                  className="bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition"
                >
                  {t("cancelModal")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                  className={`px-4 py-2 rounded transition ${isSaveDisabled
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
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
