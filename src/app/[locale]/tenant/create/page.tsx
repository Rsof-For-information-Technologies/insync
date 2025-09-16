"use client";
import { createTenant } from "@/apiCalls/tenant/tenantApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { CreateTenantRequest } from "@/types/tenant/createTenant";
import { UserRole } from "@/types/userRoles";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useMedia from "react-use/lib/useMedia";
import { Input } from "rizzui";
import { toast } from "sonner";
import Header from "../../(components)/CommonHeader";
import { CreateTenantSchema, createTenantValidator } from "@/validators/tenant/createTenant";
import { zodResolver } from "@hookform/resolvers/zod";

const initialValues = {
    name: "",
    domain: "",
};

export default function CreateTenantPage() {
    const t = useTranslations("TenantPages.createTenantPage");
    const router = useRouter();
    const { locale } = useParams<Params>();
    const isMedium = useMedia("(max-width: 1200px)", false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTenantSchema>({
        resolver: zodResolver(createTenantValidator),
        defaultValues: initialValues,
    });

    const onSubmit = async (state: CreateTenantRequest) => {
        try {
            const response = await createTenant({ name: state.name, domain: state.domain });
            if (response.succeeded) {
                toast.success(response.message || "Tenant Created");
                router.push(`/${locale}${routes.tenant.list}`);
            } else {
                toast.error(response.message || "Failed to create tenant");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Authenticate>
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate>
                <div className="flex flex-col space-y-6">
                    <Header title={t("title")} description={t("description")} />
                    <div className="bg-gray-50 rounded-lg shadow-sm p-6 dark:bg-gray-100 w-full max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-5">
                                <Input
                                    type="text"
                                    size="lg"
                                    label={t("form.name")}
                                    id="name"
                                    placeholder={t("form.namePlaceholder")}
                                    className="[&>label>span]:font-medium"
                                    inputClassName="text-base font-medium"
                                    error={errors.name?.message}
                                    {...register("name")}
                                />
                                <Input
                                    type="text"
                                    size="lg"
                                    label={t("form.domain")}
                                    id="domain"
                                    placeholder={t("form.domainPlaceholder")}
                                    className="[&>label>span]:font-medium"
                                    inputClassName="text-sm"
                                    error={errors.domain?.message}
                                    {...register("domain")}
                                />
                                <FormStatusButton
                                    className="w-full @xl:w-auto dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                                    size={isMedium ? "lg" : "lg"}
                                >
                                    {t("form.btn.createBtn")}
                                </FormStatusButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}
