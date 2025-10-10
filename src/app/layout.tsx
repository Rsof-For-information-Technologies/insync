import { inter } from "@/app/fonts";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { SoonerToaster } from "@/components/shadCn/ui/sooner";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/utils/class-names";
import type { Metadata } from "next";
import { Suspense } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Insync Chatbot",
  description: "Insync Chatbot is a platform that connects property sellers with potential buyers, making the process of selling properties easier and more efficient.",
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {

  return (
    <html
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(inter.variable, "font-lama")}
      >
        <Suspense>
          <SoonerToaster position="bottom-right" duration={(1000 * 5)} richColors />
          <ThemeProvider>
            {children}
            <GlobalDrawer />
            <GlobalModal />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
