import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { Title } from "rizzui";
import { useTranslations } from "next-intl";
import { UserRole } from "@/types/userRoles";
import EmbeddedSignup from "./(components)/EmbeddedSignup";

const Dashboard = () => {

    const t = useTranslations("Channel");
    return (
        <Authenticate>
            <Authorize
                allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]}
                navigate={true}
            >
                <div className="space-y-8">
                    <div className="flex py-6">
                        <div className="w-full">
                            {/* Heading on its own line */}
                            <Title as="h2" className="mb-4">
                                {t("title")}
                            </Title>

                            <div className="flex items-center justify-between">
                                <h4>{t("description")}</h4>
                                <EmbeddedSignup
                                    appId="1415321233093673"
                                    configId="783316014058065" />
                            </div>
                        </div>
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
};

export default Dashboard;
