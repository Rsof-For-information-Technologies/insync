"use client";
import { ShadcnAvatar, ShadcnAvatarFallback } from "@/components/shadCn/ui/avatar";
import { routes } from "@/config/routes";
import { useUserStore } from "@/store/user.store";
import { Params } from "@/types/params";
import cn from "@/utils/class-names";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { PiLockKey, PiSignOut } from "react-icons/pi";
import { Button, Popover, Text, Title } from "rizzui";
import { User } from "@/types/profile/getProfile";
import { getProfile } from "@/apiCalls/userProfile/userProfile";

function DropdownMenu() {
  const { logOutUser, userInfo } = useUserStore();
  const { locale } = useParams<Params>()
  const router = useRouter();
  const t = useTranslations("ProfileMenu");
  const [user, setUser] = useState<User>();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userInfo?.userId) {
          const { data } = await getProfile({ userId: userInfo.userId });
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [userInfo]);


  return (
    <div className="w-64 text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-5 pb-5 pt-6">
        <ShadcnAvatar className="!h-9 w-9 sm:!h-10 sm:!w-10">
          <ShadcnAvatarFallback>
            {user?.profilePicture ? (
              <div>
                <Image
                  width={50}
                  height={50}
                  src={`data:image/png;base64,${user.profilePicture}`}
                  alt="Profile"
                />
              </div>
            ) : (
              <div>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
          </ShadcnAvatarFallback>
        </ShadcnAvatar>
        <Link href={`/${locale}${routes.profile.userProfile}`} className="ms-3">
          <Title as="h6" className="font-semibold max-w-42 break-words">
            {user?.firstName + " " + user?.lastName}
          </Title>
          <Text className="text-gray-600 max-w-42 break-words">{user?.email}</Text>
        </Link>
      </div>
      <div className="px-6 pb-5 pt-5">
        <Link href={`/${locale}${routes.profile.changePassword}`}>
          <div className="flex items-center">
            <PiLockKey className={cn("h-5 w-5", locale === 'ar' ? "ml-2 mr-0" : "mr-2")} /> {t('changePassword')}
          </div>
        </Link>
      </div>
      <div className="border-t border-gray-300 px-6 pb-5 pt-5">
        <Link href={`/${locale}${routes.profile.userProfile}`}>
          <div className="flex items-center">
            <FaRegUser className={cn("h-5 w-5", locale === 'ar' ? "ml-2 mr-0" : "mr-2")} /> {t('userProfile')}
          </div>
        </Link>
      </div>
      <div className="border-t border-gray-300 px-6 pb-5 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() => {
            logOutUser(true);
            router.push(`/${locale}${routes.auth.login}`);
          }}
        >
          <PiSignOut className={cn("h-5 w-5", locale === 'ar' ? "ml-2 mr-0" : "mr-2")} /> {t('signOut')}
        </Button>
      </div>
    </div>
  );
}

export default function ProfileMenu({
  buttonClassName,
  username = false,
}: { buttonClassName?: string; avatarClassName?: string; username?: boolean; }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<User>();
  const { userInfo } = useUserStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userInfo?.userId) {
          const { data } = await getProfile({ userId: userInfo.userId });
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [userInfo]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement="bottom-end"
    >
      <Popover.Trigger>
        <Button
          className={cn(
            "w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10",
            buttonClassName
          )}
        >
          <ShadcnAvatar className="!h-9 w-9 sm:!h-10 sm:!w-10">
            <ShadcnAvatarFallback>
            {user?.profilePicture ? (
              <div>
                <Image
                  width={50}
                  height={50}
                  src={`data:image/png;base64,${user.profilePicture}`}
                  alt="Profile"
                />
              </div>
            ) : (
              <div>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
          </ShadcnAvatarFallback>
          </ShadcnAvatar>


          {!!username && (
            <span className="username hidden text-gray-200 md:inline-flex dark:text-gray-700">
              Hi, Mohsin
            </span>
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Content className="z-[9999] p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
        <DropdownMenu />
      </Popover.Content>
    </Popover>
  );
}
