import { getAllOrganizations } from "@/apiCalls/organization/organizationApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { UserRole } from "@/types/userRoles";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../(components)/CommonHeader";
import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { getOrganizationColumns } from "@/app/shared/table-list/organizationColumns";

export const metadata: Metadata = {
  title: "Organization Management",
};

export default async function OrganizationTablePage({ params }: { params: Params }) {
  const t = await getTranslations('OrganizationPages.organizationListPage')
  const organizations = await getAllOrganizations();
  const { locale } = params;
  const columns = getOrganizationColumns

  return (
    // <Authenticate >
    //   <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
    <div className="flex flex-col space-y-6">
      <Header
        title={t('title')}
        description={t('description')}
        icon={<Plus size={18} />}
        btnText={t('navigateCreateOrganization.createOrganizationBtn')}
        href={`/${locale}${routes.organization.create}`}
      />
      {/* Table Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <BasicTableWidget
          title={t('organizationTable.title')}
          variant="minimal"
          data={organizations}
          getColumns={columns}
          enablePagination
          searchPlaceholder={t('organizationTable.searchPlaceholder')}
          className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
        />
      </div>
    </div>
    //   </Authorize>
    // </Authenticate>
  );
}
