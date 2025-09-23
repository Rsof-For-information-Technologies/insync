"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Password } from "rizzui";
import { useParams, useRouter } from "next/navigation";
import { ChangePasswordSchema, changePasswordValidator } from "@/validators/profile/updatePassword";
import HorizontalFormBlockWrapper from "@/app/shared/modal-views/horiozontal-block";
import { useUserStore } from "@/store/user.store";
import { toast } from "sonner";
import { PiArrowLeft } from "react-icons/pi";
import { useTranslations } from "next-intl";
import { changePassword } from "@/apiCalls/auth/authApi";
import { Params } from "@/types/params";
import { routes } from "@/config/routes";
import Header from "../../(components)/CommonHeader";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

export default function PasswordSettingsView() {
  const t = useTranslations("ProfilePages.changePasswordPage");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { userInfo } = useUserStore();
  const { locale } = useParams<Params>()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordValidator),
    defaultValues: {
      userId: "",
      currentPassword: "",
      newPassword: "",
    },
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
      setLoading(true);
      const response = await changePassword({
        userId: data.userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.isSuccess) {
        const msg = response.successes?.[0] || t('success');
        toast.success(msg);
        router.push(`/${locale}${routes.dashboard}`);
      } else {
        const msg = response.errors?.[0] || t('error');
        toast.error(msg);
        reset();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo?.userId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

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
              className="@container"
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
                    disabled={isLoading}
                  >
                    {t('btn.cancel')}
                  </Button>
                  <Button
                    id="submit-password-change"
                    type="submit"
                    variant="solid"
                    isLoading={isLoading}
                    disabled={isLoading || !userInfo.userId}
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
