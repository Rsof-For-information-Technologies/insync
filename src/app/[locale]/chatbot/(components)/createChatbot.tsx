"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input, Switch } from "rizzui";
import { registerChatbot } from "@/apiCalls/chatbot/chatApi";
import type { CreateChatbotRequest , CreateChatbotResponse} from '@/types/chatbot/createChatbot';

const CreateChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [keyword, setKeyword] = useState<string[]>([]);
    const t = useTranslations('Chatbot');
    const router = useRouter();
    function modalOpen() {
        setIsOpen(true)
        setError('');
        setName('');
        setKeyword([]);
    }

    function closeModal() {
        setIsOpen(false)

    }

    async function nextButton() {
        console.log('next button clicked', name, keyword);
        if (!name || keyword.length === 0) {
            setError('Please fill both fields');
            return;
        }
        setError('');
        const payload: CreateChatbotRequest = {
            "organizationID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "tenantID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            name: name,
            keywords: keyword
        };
        console.log('payload', payload);
        try {
            const apiRes: CreateChatbotResponse = await registerChatbot(payload);
            console.log("API response:", apiRes);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Request failed";
            console.error("API error:", message);
        }
        router.push('chatbot/chatbotView');
        setIsOpen(false);
    }
    return (
        <>
            <div>
                <a onClick={modalOpen} className="cursor-pointer bg-black pt-[12px] pb-[12px] pl-[20px] pr-[20px] font-semibold rounded-xl text-white">{t('createButton')}</a>
            </div>

            {
                isOpen && (
                    <>
                        <div className="fixed inset-0 bg-[rgba(17,25,39,0.27)] z-[100]"></div>
                        <div className="z-[100] rounded-lg px-[24px] max-w-[600px] w-full absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 shadow-md">
                            <h3 className="py-[16px]">Create Chatbot</h3>
                            <div className="mt-[16px] mb-[8px]">
                                <Input
                                    type="text"
                                    size="lg"
                                    placeholder="Chatbot Name"
                                    className="[&>label>span]:font-medium"
                                    onChange={(e) => {setName(e.target.value); setError('')}}
                                />
                            </div>
                            <div className="mt-[16px] mb-[8px]">
                                <Input
                                    type="text"
                                    size="lg"
                                    placeholder="Keywords"
                                    className="[&>label>span]:font-medium"
                                    disabled={keyword.includes("*")}
                                    value={keyword}
                                    onChange={(e) => {setKeyword(e.target.value.split(',')); setError('')}}
                                />
                            </div>
                            <div className="pt-[16px] pb-[20px] flex items-center">
                                <span className="text-red-600 mr-[7px]">{error}</span>
                                <span className="mr-[9px]">Any keyword chatbot</span>
                                <Switch
                                    variant="outline"
                                    onChange={(e) =>
                                        e.target.checked ? setKeyword(["*"]) : setKeyword([])
                                    }
                                />
                            </div>
                            <div className="pb-[8px] flex justify-end item-center">
                                <button onClick={closeModal} className="py-[9px] px-[16px] font-semibold hover:bg-gray-50 rounded-lg mr-[5px]">Cancel</button>
                                <button onClick={nextButton} className="py-[9px] px-[16px] font-semibold rounded-lg text-white bg-black">Next</button>
                            </div>
                        </div>
                    </>
                )
            }

        </>
    );
}

export default CreateChatbot;
