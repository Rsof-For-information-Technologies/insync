"use client";

import { createProject } from "@/apiCalls/projects/userApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { CreateProjectRequest } from "@/types/project/createProject";
import { UserRole } from "@/types/userRoles";
import { CreateProjectSchema, createProjectValidator } from "@/validators/project/createProject";
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
  description: "",
  tenantId: "",
  organizationId: "",
};

export default function CreateProjectPage() {
  const t = useTranslations("ProjectPages.createProjectPage");
  const router = useRouter();
  const { locale } = useParams<Params>();
  const isMedium = useMedia("(max-width: 1200px)", false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectValidator),
    defaultValues: initialValues,
  });

  const onSubmit = async (state: CreateProjectRequest) => {
    try {
      const response = await createProject({
        name: state.name,
        description: state.description,
        tenantId: state.tenantId,
        organizationId: state.organizationId,
      });
      if (response.success) {
        toast.success(response.message || "Project Created");
        router.push(`/${locale}${routes.project.list}`);
      } else {
        toast.error(response.message || "Failed to create project");
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
                  label={t("form.description")}
                  id="description"
                  placeholder={t("form.descriptionPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.description?.message}
                  {...register("description")}
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
                <Input
                  type="text"
                  size="lg"
                  label={t("form.organizationId")}
                  id="organizationId"
                  placeholder={t("form.organizationIdPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.organizationId?.message}
                  {...register("organizationId")}
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
