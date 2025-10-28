"use client";

import { changePassword } from "@/apiCalls/auth/authApi";
import HorizontalFormBlockWrapper from "@/app/shared/modal-views/horiozontal-block";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { routes } from "@/config/routes";
import { useUserStore } from "@/store/user.store";
import { Params } from "@/types/params";
import { UserRole } from "@/types/userRoles";
import { ChangePasswordSchema, changePasswordValidator } from "@/validators/profile/updatePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiArrowLeft } from "react-icons/pi";
import { Button, Password } from "rizzui";
import { toast } from "sonner";
import Header from "../../(components)/CommonHeader";

export default function PasswordSettingsView() {
  const t = useTranslations("ProfilePages.changePasswordPage");
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { locale } = useParams<Params>()

  const initialValues = {
    userId: "",
    currentPassword: "",
    newPassword: "",
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordValidator),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (userInfo?.userId) {
      setValue("userId", userInfo.userId);
    }
  }, [userInfo]);

  const onSubmit = async (data: ChangePasswordSchema) => {
    if (!userInfo?.userId) {
      toast.error("User information not loaded. Please refresh the page.");
      return;
    }

    try {
      const response = await changePassword({
        userId: data.userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        toast.success(response.message || "User Created");
        router.push(`/${locale}${routes.auth.login}`);
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
     <Authenticate>
       <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col space-y-6">
          <Header
            title={t('title')}
            description={t('description')}
            icon={<PiArrowLeft size={18} />}
            btnText={t('navigateBack.back')}
          />
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 dark:bg-gray-100 w-full max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="password-change-form"
            >
              <div className="mx-auto w-full max-w-screen-sm">
                <HorizontalFormBlockWrapper
                  title={t('form.currentPassword')}
                  titleClassName="text-base font-medium"
                >
                  <Password
                    id="current-password"
                    {...register("currentPassword")}
                    placeholder={t('form.currentPasswordPlaceholder')}
                    error={errors.currentPassword?.message}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title={t('form.newPassword')}
                  titleClassName="text-base font-medium"
                >
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field }) => (
                      <Password
                        {...field}
                        id="new-password"
                        placeholder={t('form.newPasswordPlaceholder')}
                        error={errors.newPassword?.message}
                      />
                    )}
                  />
                </HorizontalFormBlockWrapper>

                <div className="mt-6 flex w-auto items-center justify-end gap-3">
                  <Button
                    id="cancel-password-change"
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    {t('btn.cancel')}
                  </Button>
                  <Button
                    id="submit-password-change"
                    type="submit"
                    variant="solid"
                  >
                    {t('btn.updatePassword')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        </Authorize>
     </Authenticate>
  );
}
