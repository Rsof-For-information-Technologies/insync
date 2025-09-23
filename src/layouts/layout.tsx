"use client"
import { useDrawerStore } from '@/app/shared/drawer-views/use-drawer';
import { routes } from '@/config/routes';
import Header from '@/layouts/header';
import { Params } from '@/types/params';
import { useParams, usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import SidebarClientWrapper from './sideBar/sidebar-client-wrapper';

export default function HydrogenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: { isOpen, screenWidth, userToggled }, openDrawer } = useDrawerStore()
  const pathname = usePathname();
  const { locale } = useParams<Params>()
  const authRoutes = [`/${locale}${routes.auth.login}`, `/${locale}${routes.auth.signup}`, `/${locale}${routes.auth.forgotPassword}`, `/${locale}${routes.auth.resetPassword}`];
  const isAuthPage = authRoutes.includes(pathname);

  useEffect(() => {
    if (!userToggled && !isOpen && (screenWidth as number) > 1280) {
      openDrawer({ isOpen: true });
    }
  }, [isOpen, openDrawer, screenWidth, userToggled, pathname]);

  return (
    <main className={`flex min-h-screen flex-grow ${isAuthPage ? "pt-[80px]" : "pt-[80px]"}`}>

      {!isAuthPage && (
        <Suspense>
          <SidebarClientWrapper className="fixed hidden xl:block dark:bg-gray-50" />
        </Suspense>
      )}

      <div className={`flex w-full flex-col flex-1 ${isOpen && (screenWidth as number) > 1280 && !isAuthPage ? "xl:ms-[270px]" : ""}`} >
        <Header />

        <div id='main-page-container' className="flex flex-grow flex-col px-[10px] sm:px-4 pb-6 pt-2 md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9 @container">
          {children}
        </div>

      </div>

    </main>
  );
}
