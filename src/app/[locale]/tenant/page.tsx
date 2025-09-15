import { getAllTenants } from "@/apiCalls/tenant/tenantApis";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import type { Tenant } from "@/types/tenant/getAllTenant";
import { UserRole } from "@/types/userRoles";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../(components)/CommonHeader";
import StatsOverview from "./(components)/statsOverview";
import { getTenantColumns } from "@/app/shared/table-list/tenantColumns";

export const metadata: Metadata = {
  title: "Tenant Management",
};

export default async function TenantTablePage() {
  const t = await getTranslations('TenantPages.tenantListPage')
  const tenants: Tenant[] = await getAllTenants();

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col space-y-6">
          {/* header */}
          <Header
            title={t('title')}
            description={t('description')}
            icon={<Plus size={18} />}
            btnText={t('navigateCreateTenant.createTenantBtn')}
          />

          {/* Stats Overview */}
          <StatsOverview data={tenants} />

          {/* Table Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <BasicTableWidget
              title={t('tenantTable.title')}
              variant="minimal"
              data={tenants}
              // @ts-ignore
              getColumns={getTenantColumns}
              enablePagination
              searchPlaceholder={t('tenantTable.searchPlaceholder')}
              className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
            />
          </div>
        </div>
      </Authorize>
    </Authenticate>
  );
}
