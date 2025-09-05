import { Metadata } from "next";
import ForgotPasswordForm from "./forgotPasswordForm";
import { getTranslations } from "next-intl/server";
import UnderlineShape from "@/components/shape/underline";
import AuthWrapperOne from "@/app/shared/auth-layout/auth-wrapper-one";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default async function ForgotPassword() {
  const t = await getTranslations("ForgotPasswordPage.title");

  return (
    <AuthWrapperOne
      title={
        <>
          <span className="relative inline-block">
            {t("line1")} <br className="hidden sm:inline-block" /> {t("line2")}
            <UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-24 text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
          </span>{" "}
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
      <ForgotPasswordForm />
    </AuthWrapperOne>
  );
}
