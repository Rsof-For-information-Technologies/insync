import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { Title } from "rizzui";
import { useTranslations } from "next-intl";
import { UserRole } from "@/types/userRoles";

const Dashboard = () => {
    const t = useTranslations('Dashboard')
    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="space-y-8">
                    <div className="flex py-6">
                        <div>
                            <Title as="h2" className="mb-4">{t('title')}</Title>
                            <p className="text-gray-600">{t('description')}</p>
                        </div>
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}

export default Dashboard;
