"use client";
import { registerUser } from "@/apiCalls/auth/authApi";
import { FormStatusButton } from "@/components/formStatusButton";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import cn from '@/utils/class-names';
import { removeLocalStorage } from "@/utils/localStorage";
import { SignupSchema, signupValidator } from "@/validators/auth/signup.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PiArrowRightBold } from "react-icons/pi";
import useMedia from "react-use/lib/useMedia";
import { Input, Password, Text } from "rizzui";
import { toast } from "sonner";

const initialValues = {
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Company: "",
    PhoneNumber: "",
    ProfilePicture: null as File | null,
};

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { locale } = useParams<Params>();
    const isMedium = useMedia("(max-width: 1200px)", false);
    const t = useTranslations('SignUpPage.form');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SignupSchema>({
        resolver: zodResolver(signupValidator),
        defaultValues: { ...initialValues },
    });

    const onSubmit = async (state: SignupSchema) => {
        try {
            const formData = new FormData();
            formData.append('Email', state.Email);
            formData.append('Password', state.Password);
            formData.append('ConfirmPassword', state.ConfirmPassword);
            formData.append('FirstName', state.FirstName);
            formData.append('LastName', state.LastName);
            formData.append('Company', state.Company);
            formData.append('PhoneNumber', state.PhoneNumber);

            if (state.ProfilePicture && state.ProfilePicture instanceof File) {
                formData.append('ProfilePicture', state.ProfilePicture);
            }
            const response = await registerUser(formData);
            console.log("registration response", response);
            if (response.success) {
                toast.success(response.data);
                router.push(`/${locale}${routes.auth.login}`);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const logout = searchParams.get("logout");
    useEffect(() => {
        if (logout === "true") {
            const urlSearchParams = new URLSearchParams(searchParams.toString());
            removeLocalStorage("user-info");
            urlSearchParams.delete("logout");
            router.push(`/${locale}${routes.auth.signup}?${urlSearchParams}`);
        }
    }, [logout, router, searchParams]);

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="text"
                    size="lg"
                    label={t('firstName')}
                    id="firstName"
                    placeholder={t('firstNamePlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.FirstName?.message}
                    {...register("FirstName")}
                />
                <Input
                    type="text"
                    size="lg"
                    label={t('lastName')}
                    id="lastName"
                    placeholder={t('lastNamePlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.LastName?.message}
                    {...register("LastName")}
                />
                <Input
                    type="email"
                    size="lg"
                    label={t('email')}
                    id="email"
                    placeholder={t('emailPlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.Email?.message}
                    {...register("Email")}
                />
                <Password
                    label={t('password')}
                    id="password"
                    placeholder={t('passwordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.Password?.message}
                    {...register("Password")}
                />
                <Password
                    label={t('confirmPassword')}
                    id="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.ConfirmPassword?.message}
                    {...register("ConfirmPassword")}
                />
                <Input
                    label={t('company')}
                    id="company"
                    placeholder={t('companyPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.Company?.message}
                    {...register("Company")}
                />
                <Input
                    label="Phone Number"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.PhoneNumber?.message}
                    {...register("PhoneNumber")}
                />
                <div className="[&>label>span]:font-medium">
                    <label htmlFor="uploadProfilePicture" className="block text-sm font-medium text-gray-700">
                        {t('profilePicture') || 'Upload Profile Picture'}
                    </label>
                    <input
                        id="uploadProfilePicture"
                        type="file"
                        accept="image/*"
                        className="mt-1 p-2 block w-full text-sm text-gray-700 border-2 border-gray-200 rounded-md"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setValue('ProfilePicture', file);
                            }
                        }}
                    />
                    {errors.ProfilePicture?.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.ProfilePicture.message}</p>
                    )}
                </div>

                <FormStatusButton
                    className="w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black"
                    type="submit"
                    size={isMedium ? "lg" : "lg"}>
                    <span>{t('signupBtn')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
            <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
                Already have an account?{' '}
                <Link
                    href={`/${locale}${routes.auth.login}`}
                    className="font-semibold text-[var(--default-text-color)] transition-colors hover:text-[var(--default-text-hover)] "
                >
                    Sign In
                </Link>
            </Text>
        </form>
    );
}

export default SignupForm;
