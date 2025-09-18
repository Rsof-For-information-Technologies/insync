import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { Title } from "rizzui";
import { useTranslations } from "next-intl";
import { UserRole } from "@/types/userRoles";
import CreateChatbot  from "./(components)/createChatbot";

const Chatbot = () => {
    const t = useTranslations('Chatbot')
    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="space-y-8 relative">
                    <div className="flex py-6">
                        <div className="flex justify-between w-full items-center">
                            <Title as="h2" className="mb-4">{t('title')}</Title>
                            <CreateChatbot />
                        </div>
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}

export default Chatbot;
