"use client";

import { createUser } from "@/apiCalls/user/userApis";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { CreateUserRequest } from "@/types/user/createUser";
import { CreateUserSchema, createUserValidator } from "@/validators/user/createUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "rizzui";
import { toast } from "sonner";
import Header from "../../(components)/CommonHeader";
import useMedia from "react-use/lib/useMedia";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

const initialValues = {
  tenantId: "",
  organizationId: "",
  userId: "",
  email: "",
};

export default function CreateUserPage() {
  const t = useTranslations("UserPages.createUserPage");
  const router = useRouter();
  const { locale } = useParams<Params>();
  const isMedium = useMedia("(max-width: 1200px)", false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserValidator),
    defaultValues: initialValues,
  });

  const onSubmit = async (state: CreateUserRequest) => {
    try {
      const response = await createUser({
        tenantId: state.tenantId,
        organizationId: state.organizationId,
        userId: state.userId,
        email: state.email,
      });
      if (response.success) {
        toast.success(response.message || "User Created");
        router.push(`/${locale}${routes.user.list}`);
      } else {
        toast.error(response.message || "Failed to create user");
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
                <Input
                  type="text"
                  size="lg"
                  label={t("form.userId")}
                  id="userId"
                  placeholder={t("form.userIdPlaceholder")}
                  className="[&>label>span]:font-medium"
                  inputClassName="text-base font-medium"
                  error={errors.userId?.message}
                  {...register("userId")}
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
