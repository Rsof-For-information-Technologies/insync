import { getAllChatbots } from "@/apiCalls/chatbot/chatbotApi";
import { getChatbotColumns } from "@/app/shared/table-list/chatbotColumns";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { UserRole } from "@/types/userRoles";
import { Metadata } from "next";
import { Title } from "rizzui";
import CreateChatbot from "./(components)/createChatbot";

export const metadata: Metadata = {
    title: "Chatbot",
};

export default async function Chatbot() {
    const response = await getAllChatbots();
    const chatbot = response.data;
    const columns = getChatbotColumns;

    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="space-y-8 relative">
                    <div className="flex py-6">
                        <div className="flex justify-between w-full items-center">
                            <Title as="h2" className="mb-4">Chatbot</Title>
                            <CreateChatbot />
                        </div>
                    </div>
                </div>
                {/* Table Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <BasicTableWidget
                        variant="minimal"
                        data={chatbot}
                        getColumns={columns}
                        enablePagination
                        searchPlaceholder="Search Chatbot"
                        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
                    />
                </div>
            </Authorize>
        </Authenticate >
    );
}





