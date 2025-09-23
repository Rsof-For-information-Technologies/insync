import AuthWrapperOne from "@/app/shared/auth-layout/auth-wrapper-one";
import UnderlineShape from "@/components/shape/underline";
import { Params } from "@/types/params";
import { T_SearchParams } from "@/types/searchParams";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import ResetPasswordForm from "./resetPasswordForm";

type QueryParams = T_SearchParams & {
    token: string
}

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset your password",
};

export default async function ResetPassword({
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