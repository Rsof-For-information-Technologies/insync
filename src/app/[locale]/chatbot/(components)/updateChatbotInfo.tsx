"use client";
import React, { useState } from "react";
import { Tooltip, ActionIcon, Switch, Input } from "rizzui";
import { PencilIcon, X } from "lucide-react";
import { updateChatbot } from "@/apiCalls/chatbot/chatApi";
import type { UpdateChatbotRequest } from "@/types/chatbot/updateChatbot";

interface UpdateChatbotInfoProps {
    data: string; // chatbot id
    name?: string; // chatbot name (optional)
    keywords?: string[];
}

const UpdateChatbotInfo = ({ data, name, keywords = [] }: UpdateChatbotInfoProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false);
    const [showKeywordInput, setShowKeywordInput] = useState(false);
    const [chatbotName, setChatbotName] = useState(name || "");
    const [chatbotKeywords, setChatbotKeywords] = useState<string[]>(keywords);
    const [anyKeyword, setAnyKeyword] = useState(false);
    const [nameError, setNameError] = useState("");
    const [keywordError, setKeywordError] = useState("");

    const openModal = () => {
        setChatbotName(name || "");
        setChatbotKeywords(keywords);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setShowNameInput(false);
        setShowKeywordInput(false);
        setNameError("");
        setKeywordError("");
    };

    const handleCancelName = () => {
        setShowNameInput(false);
        setChatbotName(name || "");
        setNameError("");
    };

    const handleCancelKeyword = () => {
        setShowKeywordInput(false);
        setChatbotKeywords(keywords || []);
        setKeywordError("");
    };

    const handleSaveName = async () => {
        if (!chatbotName.trim()) {
            setNameError("Fill the field");
            return;
        }
        if (chatbotName.trim() === name) {
            setNameError("This chatbot name already exists");
            return;
        }

        try {
            const payload: UpdateChatbotRequest = {
                id: data,
                name: chatbotName.trim(),
                keywords: chatbotKeywords,
                isActive: true,
            };

            await updateChatbot(payload);
            closeModal();
        } catch {
            setNameError("Failed to update chatbot name");
        }
    };

    const handleSaveKeyword = async () => {
        if (chatbotKeywords.length === 0 && !anyKeyword) {
            setKeywordError("Please fill the field");
            return;
        }

        try {
            const payload: UpdateChatbotRequest = {
                id: data,
                name: chatbotName.trim() || name || "",
                keywords: anyKeyword ? ["*"] : chatbotKeywords,
                isActive: true,
            };

            await updateChatbot(payload);
            closeModal();
        } catch {
            setKeywordError("Failed to update chatbot keyword");
        }
    };

    const handleToggleSwitch = (checked: boolean) => {
        setAnyKeyword(checked);
        if (checked) {
            setChatbotKeywords(["*"]);
        } else {
            setChatbotKeywords([]);
        }
    };

    return (
        <div>
            {/* Tooltip Button */}
            <Tooltip size="sm" content="Edit" placement="top" color="invert">
                <ActionIcon
                    as="span"
                    size="sm"
                    variant="outline"
                    onClick={openModal}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:border-blue-400"
                >
                    <PencilIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </ActionIcon>
            </Tooltip>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Edit Chatbot
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-4 space-y-4">
                            {/* Keyword Switch */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Any keyword
                                </span>
                                <Switch
                                    checked={anyKeyword}
                                    onChange={(e) => handleToggleSwitch(e.target.checked)}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowNameInput((prev) => !prev)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    Change Name
                                </button>
                                <button
                                    onClick={() => setShowKeywordInput(true)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    Change Keyword
                                </button>
                            </div>

                            {/* Name Input Section */}
                            {showNameInput && (
                                <div className="mt-4 space-y-3">
                                    <Input
                                        type="text"
                                        size="lg"
                                        label="Update Chatbot Name"
                                        value={chatbotName}
                                        onChange={(e) => setChatbotName(e.target.value)}
                                        placeholder="Enter new chatbot name"
                                        inputClassName="text-sm"
                                        error={nameError}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={handleCancelName}
                                            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveName}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Keyword Input Section */}
                            {showKeywordInput && (
                                <div className="mt-4 space-y-3">
                                    <Input
                                        type="text"
                                        size="lg"
                                        label="Update Chatbot Keyword"
                                        value={chatbotKeywords.join(", ")}
                                        disabled={anyKeyword}
                                        onChange={(e) =>
                                            setChatbotKeywords(
                                                e.target.value
                                                    .split(",")
                                                    .map((k) => k.trim())
                                                    .filter((k) => k.length > 0)
                                            )
                                        }
                                        placeholder="Enter keywords separated by commas"
                                        inputClassName="text-sm"
                                        error={keywordError}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={handleCancelKeyword}
                                            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveKeyword}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateChatbotInfo;
