"use client";

import { useTranslations } from "next-intl";
import Sidebar from "./sidebar";

export default function SidebarClientWrapper({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations("SideMenu");

  return <Sidebar className={className} t={t} />;
}
