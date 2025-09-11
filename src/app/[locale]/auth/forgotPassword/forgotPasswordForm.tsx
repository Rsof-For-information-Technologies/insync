"use client";
import { forgotPassword } from "@/apiCalls/auth/authApi";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import cn from '@/utils/class-names';
import { ForgetPasswordSchema, forgetPasswordValidator } from "@/validators/auth/forgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from 'react-icons/pi';
import useMedia from "react-use/lib/useMedia";
import { Input, Text } from "rizzui";
import { toast } from "sonner";

const initialValues = {
    email: "",
};

export default function ForgotPasswordForm() {
    const isMedium = useMedia("(max-width: 1200px)", false);
    const t = useTranslations("ForgotPasswordPage");
    const { locale } = useParams<Params>();

    const { register, handleSubmit, formState: { errors }, setError, reset, } = useForm<ForgetPasswordSchema>({
        resolver: zodResolver(forgetPasswordValidator),
        defaultValues: { ...initialValues },
    });

    const onSubmit = async (state: ForgetPasswordSchema) => {
        try {
            const payload = { email: state.email };
            const data = await forgotPassword(payload);

            if (!data.isSuccess) {
                const msg = data.errors?.[0] || "Something went wrong";
                toast.error(msg);
                return;
            }

            const successMsg = data.successes?.[0] || "Reset link sent successfully to the email";
            toast.success(successMsg);
            reset();
        } catch (error) {
            if (
                (error as any).response?.data &&
                Object.entries((error as any).response?.data).length
            ) {
                for (let [key, value] of Object.entries((error as any).response?.data)) {
                    setError(key as any, { type: "custom", message: value as string });
                }
            }
        }
    };

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="email"
                    size="lg"
                    label={t('form.email')}
                    placeholder={t('form.emailPlaceholder')}
                    className="[&>label>span]:font-medium"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <p className="text-red-500 text-sm"> {(errors as any)?.message?.message} </p>
                <FormStatusButton
                    className="group w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black "
                    type="submit"
                    size={isMedium ? 'lg' : 'xl'}>
                    <span>{t('form.resetButton')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
            <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
                {t('footer.text1')}{" "}
                <Link
                    href={`/${locale}${routes.auth.login}`}
                    className="font-semibold text-gray-700 transition-colors hover:text-primary"
                >
                    {t('footer.text2')}
                </Link>
            </Text>
        </form>
    );
}
