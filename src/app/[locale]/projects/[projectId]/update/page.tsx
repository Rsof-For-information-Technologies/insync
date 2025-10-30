"use client";
import { getProjectById, updateProject } from "@/apiCalls/projects/userApis";
import Header from "@/app/[locale]/(components)/CommonHeader";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { UserRole } from "@/types/userRoles";
import { UpdateProjectSchema, updateProjectValidator } from "@/validators/project/updateProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "rizzui";
import { toast } from "sonner";

export default function UpdateProjectPage() {
  const t = useTranslations("ProjectPages.updateProjectPage");
  const router = useRouter();
  const Params = useParams<{ locale: string; projectId: string }>();
  const { locale, projectId } = Params;
  const [projectData, setProjectData] = useState<Partial<UpdateProjectSchema>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectValidator),
    defaultValues: {
      id: projectData.id || "",
      name: projectData.name || "",
      description: projectData.description || "",
    },
  });

  useEffect(() => {
    async function fetchOrg() {
      try {
        const { data } = await getProjectById({ id: projectId });
        setProjectData({
          id: data.id,
          name: data.name,
          description: data.description,
        });
        reset({
          id: data.id,
          name: data.name,
          description: data.description,
        });
      } catch (error) {
        toast.error("Failed to fetch organization data");
      }
    }
    if (projectId) fetchOrg();
  }, [projectId, reset]);

  const onSubmit = async (state: UpdateProjectSchema) => {
    try {
      const response = await updateProject({
        id: state.id,
        description: state.description,
      });
      if (response.success) {
        toast.success(response.message || "Project Updated Successfully");
        router.push(`/${locale}${routes.project.list}`);
      } else {
        toast.error(response.message || "Failed to update project");
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
                  label={t("form.description")}
                  id="description"
                  placeholder={t("form.descriptionPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.description?.message}
                  {...register("description")}
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
