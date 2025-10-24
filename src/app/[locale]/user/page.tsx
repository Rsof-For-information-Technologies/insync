import { getAllUsers } from "@/apiCalls/user/userApis";
import { getUserColumns } from "@/app/shared/table-list/userColumns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { GetAllUsersResponse } from "@/types/user/getAllUsers";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../(components)/CommonHeader";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

export const metadata: Metadata = {
  title: "User Management",
};

export default async function UserTablePage({ params }: { params: Params }) {
  const t = await getTranslations('UserPages.userListPage')
  const { data: usersData }: GetAllUsersResponse = await getAllUsers();
  const { locale } = params;
  const columns = getUserColumns

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col space-y-6">
          <Header
            title={t('title')}
            description={t('description')}
            icon={<Plus size={18} />}
            btnText={t('navigateCreateUser.createUserBtn')}
            href={`/${locale}${routes.user.create}`}
          />
          {/* Table Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <BasicTableWidget
              title={t('userTable.title')}
              variant="minimal"
              data={usersData ? usersData : []}
              getColumns={columns}
              enablePagination
              searchPlaceholder={t('userTable.searchPlaceholder')}
              className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
            />
          </div>
        </div>
      </Authorize>
    </Authenticate>
  );
}
