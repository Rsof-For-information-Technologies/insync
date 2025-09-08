import React from 'react'
import { Metadata } from 'next'
import LoginForm from './loginForm'
import { getTranslations } from 'next-intl/server'
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import UnderlineShape from '@/components/shape/underline';
import Image from 'next/image';

export const metadata: Metadata = {
    title: "Login",
    description: "Login to access site",
};

async function Login() {
    const t = await getTranslations("SignInPage");
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
            // bannerDescription="Amet minim mollit non deserunt ullamco est sit aliqua dolor do
            // amet sint velit officia consequat duis."
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
            <LoginForm />
        </AuthWrapperOne>
    )
}

export default Login