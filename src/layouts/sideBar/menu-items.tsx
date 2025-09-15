import { routes } from '@/config/routes';
import { FaFolderOpen} from "react-icons/fa";
import { User } from "@/types/user";
import { JSX } from "react";
import { UserRole } from '@/types/userRoles';
import { BsBuilding } from 'react-icons/bs';

// Note: do not add href in the label object, it is rendering as label
export type MenuItemDropdownItem = {
  translationKey: string;
  href: string;
  params?: boolean;
  badge: string;
  allowedRoles: UserRole[];
}

export type MenuItem = {
  translationKey: string;
  href: string;
  icon: JSX.Element;
  params?: boolean;
  allowedRoles: UserRole[];
  dropdownItems?: MenuItemDropdownItem[];
}

export function MenuItems(locale: string, user: User): MenuItem[] {

  return (
    [
      {
        translationKey: "dashboard",
        href: `/${locale}${routes.dashboard}`,
        icon: <FaFolderOpen />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
      },
      {
        translationKey: "tenant.title",
        href: `#`,
        icon: <BsBuilding />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "tenant.submenu.list",
            href: `/${locale}${routes.tenant.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          }
        ]
      },
    ]
  )
}