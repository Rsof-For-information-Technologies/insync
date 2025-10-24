"use client";

import { createOrganization } from "@/apiCalls/organization/organizationApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { CreateOrganizationRequest } from "@/types/organization/createOrganization";
import { Params } from "@/types/params";
import { UserRole } from "@/types/userRoles";
import { CreateOrganizationSchema, createOrganizationValidator, } from "@/validators/organization/createOrganization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useMedia from "react-use/lib/useMedia";
import { Input } from "rizzui";
import { toast } from "sonner";
import Header from "../../(components)/CommonHeader";

const initialValues = {
  name: "",
  phone: "",
  industryType: "",
  email: "",
  country: "",
  tenantId: "",
};

export default function CreateOrganizationPage() {
  const t = useTranslations("OrganizationPages.createOrganizationPage");
  const router = useRouter();
  const { locale } = useParams<Params>();
  const isMedium = useMedia("(max-width: 1200px)", false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrganizationSchema>({
    resolver: zodResolver(createOrganizationValidator),
    defaultValues: initialValues,
  });

  const onSubmit = async (state: CreateOrganizationRequest) => {
    try {
      const response = await createOrganization({
        name: state.name,
        phone: state.phone,
        industryType: state.industryType,
        email: state.email,
        country: state.country,
        tenantId: state.tenantId,
      });
      if (response.success) {
        toast.success(response.message || "Organization Created");
        router.push(`/${locale}${routes.organization.list}`);
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
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 dark:bg-neutral-900 h-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  label={t("form.phone")}
                  id="phone"
                  placeholder={t("form.phonePlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Input
                  type="text"
                  size="lg"
                  label={t("form.industryType")}
                  id="industryType"
                  placeholder={t("form.industryTypePlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.industryType?.message}
                  {...register("industryType")}
                />
                <Input
                  type="email"
                  size="lg"
                  label={t("form.email")}
                  id="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  type="text"
                  size="lg"
                  label={t("form.country")}
                  id="country"
                  placeholder={t("form.countryPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.country?.message}
                  {...register("country")}
                />
                <Input
                  type="text"
                  size="lg"
                  label={t("form.tenantId")}
                  id="tenantId"
                  placeholder={t("form.tenantIdPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.tenantId?.message}
                  {...register("tenantId")}
                />
              </div>

              <div className="flex justify-start">
                <FormStatusButton
                  className="w-full md:w-auto px-8 py-3 dark:bg-[#090909] dark:text-white hover:dark:bg-black"
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
