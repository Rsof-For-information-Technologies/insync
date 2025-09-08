import { T_SearchParams } from "@/types/searchParams";
import { serverAxiosInstance } from "@/utils/axios.instance";
import { logoutOnCookieExpire } from "@/utils/logoutOnCookieExpire";
import { AxiosError } from "axios";
import { Metadata } from "next";
import ResetPasswordForm from "./resetPasswordForm";
import { Params } from "@/types/params";
import { getTranslations } from "next-intl/server";
import UnderlineShape from "@/components/shape/underline";
import Image from "next/image";
import AuthWrapperOne from "@/app/shared/auth-layout/auth-wrapper-one";

type QueryParams = T_SearchParams & {
    token: string
}

type UserEmail = {
    email: string
}

export const metadata: Metadata = {
    title: "Reset Password",
};

const getUserEmail = async (searchParams: QueryParams, params: Params) => {
    try {
        const { data } = await serverAxiosInstance.get<UserEmail>('/api/user/verify/reset-token?token=' + searchParams.token)
        return { email: data.email }
    } catch (error) {
        const deleted = logoutOnCookieExpire(error, params)
        if (!deleted)
            return undefined
        console.log('error occurred while fetching user email')
        return { error: error as AxiosError }
    }
}

export default async function Page({
    searchParams,
    params,
}: {
    searchParams: QueryParams;
    params: Params
}) {
    const t = await getTranslations("ResetPasswordPage");
    return (
        <AuthWrapperOne
            title={
                <>
                    <span className="relative inline-block">
                        {t('title.line1')} <br /> {t('title.line2')}
                        <UnderlineShape className="absolute start-0 h-2.5 w-full text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
                    </span>{' '}
                </>
            }
            bannerTitle="The simplest way to manage your workspace."
            isSocialLoginActive={false}
            pageImage={
                <div className="relative mx-auto aspect-[3.6/3.3] w-[100%] xl:w-[100%]">
                    <Image
                        src={"/insync-chatbot.webp"}
                        alt="Sign Up Thumbnail"
                        fill
                        priority
                        className="object-cover "
                    />
                </div>
            }
        >
            <ResetPasswordForm email={"email" as string} />
        </AuthWrapperOne>
    )
}