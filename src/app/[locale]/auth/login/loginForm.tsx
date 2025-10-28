"use client"
import { loginUser } from '@/apiCalls/auth/authApi'
import { FormStatusButton } from '@/components/formStatusButton'
import { routes } from '@/config/routes'
import { Params } from '@/types/params'
import cn from '@/utils/class-names'
import { setCookie } from '@/utils/cookieStorage'
import { removeLocalStorage, setLocalStorage } from '@/utils/localStorage'
import { LoginSchema, loginValidator } from '@/validators/auth/login.validator'
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PiArrowRightBold } from 'react-icons/pi'
import useMedia from 'react-use/lib/useMedia'
import { Checkbox, Input, Password, Text } from 'rizzui'
import { toast } from 'sonner'

const initialValues = {
    email: "",
    password: "",
    rememberMe: true,
}

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { locale } = useParams<Params>()
    const isMedium = useMedia('(max-width: 1200px)', false);
    const t = useTranslations("SignInPage.form");

    const {
        register,
        handleSubmit, formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginValidator),
        defaultValues: { ...initialValues }
    })

    const onSubmit = async (state: LoginSchema) => {
        try {
            const response = await loginUser({
                email: state.email,
                password: state.password,
            });
            if (response.success) {
                setLocalStorage("user-info", {
                    userId: response.data.userId,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    profilePicture: response.data.ProfilePicture,
                    role: "Admin",
                    roles: response.data.roles,
                    tenantId: response.data.tenantId,
                });

                setCookie("access_token", response.data.token)

                if (searchParams.get("navigate_to"))
                    router.push(`${searchParams.get("navigate_to")}`)
                else {
                    toast.success(response.message);
                    router.push(`/${locale}${routes.dashboard}`)
                }

            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const logout = searchParams.get("logout")
    useEffect(() => {

        if (logout === "true") {
            const urlSearchParams = new URLSearchParams(searchParams.toString());
            removeLocalStorage("user-info");
            urlSearchParams.delete("logout");
            router.push(`/${locale}${routes.auth.login}?${urlSearchParams}`)
        }
    }, [logout, router, locale, searchParams])

    return (
        <form action={() => handleSubmit(onSubmit)()}>
            <div className="space-y-5">
                <Input
                    type="email"
                    size="lg"
                    label={t('email')}
                    id='email'
                    placeholder={t('emailPlaceholder')}
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Password
                    label={t('password')}
                    id='password'
                    placeholder={t('passwordPlaceholder')}
                    size="lg"
                    className="[&>label>span]:font-medium"
                    inputClassName="text-sm"
                    error={errors.password?.message}
                    {...register('password')}
                />
                <p className='text-red-500 text-sm'>{(errors as any)?.message?.message}</p>
                <div className="flex items-center justify-between pb-2">
                    <Checkbox
                        {...register('rememberMe')}
                        label={t('rememberMe')}
                        className="[&>label>span]:font-medium"
                    />
                    <Link
                        href={`/${locale}${routes.auth.forgotPassword}`}
                        className="h-auto p-0 text-sm font-semibold text-gray-700 underline transition-colors hover:text-primary hover:no-underline"
                    >
                        {t('forgotPassword')}
                    </Link>
                </div>

                <FormStatusButton
                    className="group w-full @xl:w-full dark:bg-[#090909] dark:text-white hover:dark:bg-black "
                    type="submit"
                    size={isMedium ? 'lg' : 'lg'}>
                    <span>{t('loginBtn')}</span>
                    <PiArrowRightBold className={cn("ms-2 mt-0.5 h-5 w-5", locale === 'ar' ? 'rotate-180' : 'rotate-0')} />
                </FormStatusButton>
            </div>
            <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
                {t('DontHaveanAccount')} {' '}
                <Link
                    href={`/${locale}${routes.auth.signup}`}
                    className="font-semibold text-[var(--default-text-color)] transition-colors hover:text-[var(--default-text-hover)] "
                >
                    {t('signup')}
                </Link>
            </Text>
        </form>
    )
}

export default LoginForm
