"use client";

import { resetPassword as resetPasswordApi } from '@/apiCalls/auth/authApi';
import { FormStatusButton } from '@/components/formStatusButton';
import { routes } from '@/config/routes';
import { Params } from '@/types/params';
import cn from '@/utils/class-names';
import { ResetPassword, resetPasswordValidator } from '@/validators/auth/resetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import useMedia from "react-use/lib/useMedia";
import { Password } from 'rizzui';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const initialValues = {
    newPassword: "",
    confirmPassword: "",
};

function ResetPasswordForm({ email }: { email: string }) {
    const isMedium = useMedia('(max-width: 1200px)', false);
    const router = useRouter();
    const { locale } = useParams<Params>();
    const t = useTranslations("ResetPasswordPage.form");

    const [token, setToken] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const rawSearch = window.location.search;
            const match = rawSearch.match(/token=([^&]+)/);
            setToken(match ? match[1] : "");
        }
    }, []);

    const { register, formState: { errors }, reset, setError, handleSubmit } = useForm<ResetPassword>({
        resolver: zodResolver(resetPasswordValidator),
        defaultValues: { ...initialValues }
    });

    const submitForm = async (state: ResetPassword) => {
        try {
             if (!email) {
                toast.error("Reset email not found.");
                return;
            }

            if (!token) {
                toast.error("Reset token not found.");
                return;
            }

            const payload = {
                email,
                token,
                newPassword: state.newPassword,
                confirmPassword: state.confirmPassword,
            };

            const data = await resetPasswordApi(payload);

            if (data.success) {
                const msg = data.successes?.[0] || "Password reset successfully";
                toast.success(msg);
                reset();
                router.push(`/${locale}${routes.auth.login}`);
            } else {
                const msg = data.errors?.[0] || "Something went wrong!";
                toast.error(msg);
            }
        } catch (error: any) {
            console.log(error);
            const serverErrors = error.response?.data;

            if (serverErrors?.message) {
                toast.error(serverErrors.message);
            }

            if (serverErrors && Object.entries(serverErrors).length) {
                for (let [key, value] of Object.entries(serverErrors)) {
                    setError(key as any, { type: "server", message: value as string });
                }
            }
        }
    };

    return (
        <form action={() => handleSubmit(submitForm)()}>
            <p className="text-center mb-10">
                {t('description.line1', { email })}
            </p>
            <div className="space-y-5">
                <Password
                    label={t('newPassword')}
                    id="newPassword"
                    placeholder={t('newPasswordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                />
                <Password
                    label={t('confirmPassword')}
                    id="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
                <p className="text-red-500 text-sm">{(errors as any)?.message?.message}</p>
                <FormStatusButton
                    className="w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                    type="submit"
                    size={isMedium ? 'lg' : 'lg'}>
                    <span>{t('resetButton')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
        </form>
    );
}

export default ResetPasswordForm;



