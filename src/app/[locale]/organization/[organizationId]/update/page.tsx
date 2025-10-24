"use client";
import { getOrganizationById, updateOrganization } from "@/apiCalls/organization/organizationApis";
import Header from "@/app/[locale]/(components)/CommonHeader";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { UserRole } from "@/types/userRoles";
import { UpdateOrganizationSchema, updateOrganizationValidator, } from "@/validators/organization/updateOrganization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "rizzui";
import { toast } from "sonner";

export default function UpdateOrganizationPage() {
  const t = useTranslations("OrganizationPages.updateOrganizationPage");
  const router = useRouter();
  const Params = useParams<{ locale: string; organizationId: string }>();
  const { locale, organizationId } = Params;
  const [orgData, setOrgData] = useState<Partial<UpdateOrganizationSchema>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOrganizationSchema>({
    resolver: zodResolver(updateOrganizationValidator),
    defaultValues: {
      id: orgData.id || "",
      name: orgData.name || "",
      phone: orgData.phone || "",
      industryType: orgData.industryType || "",
      email: orgData.email || "",
      country: orgData.country || "",
    },
  });

  useEffect(() => {
    async function fetchOrg() {
      try {
        const { data } = await getOrganizationById({ id: organizationId });
        setOrgData({
          id: data.id,
          name: data.name,
          phone: data.phone,
          industryType: data.industryType,
          email: data.email,
          country: data.country,
        });
        reset({
          id: data.id,
          name: data.name,
          phone: data.phone,
          industryType: data.industryType,
          email: data.email,
          country: data.country,
        });
      } catch (error) {
        toast.error("Failed to fetch organization data");
      }
    }
    if (organizationId) fetchOrg();
  }, [organizationId, reset]);

  const onSubmit = async (state: UpdateOrganizationSchema) => {
    try {
      const response = await updateOrganization({
        id: state.id,
        phone: state.phone,
        industryType: state.industryType,
        email: state.email,
        country: state.country,
      });
      if (response.success) {
        toast.success(response.message || "Organization Updated Successfully");
        router.push(`/${locale}${routes.organization.list}`);
      } else {
        toast.error(response.message || "Failed to update organization");
      }
    } catch (error) {
      toast.error("Update failed");
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
                  disabled
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
              </div>
              <div className="flex justify-start">
                <FormStatusButton
                  className="w-full md:w-auto px-8 py-3 dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                  size="lg"
                >
                  {t("form.btn.updateBtn")}
                </FormStatusButton>
              </div>
            </form>
          </div>
        </div>
      </Authorize>
    </Authenticate>
  );
}
