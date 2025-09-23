import type { Tenant } from "@/types/tenant/getAllTenant";
import { Building, CreditCard, Package, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
interface StatsOverviewProps {
  data: Tenant[];
}

export default async function StatsOverview({ data }: StatsOverviewProps) {
  const t = await getTranslations('TenantPages.tenantListPage.statsOverview')
  const totalTenants = data.length;
  const activeTenants = data.filter((t) => t.isActive).length;
  const inactiveTenants = data.filter((t) => !t.isActive).length;
  const recentCreated = data
    .map((t) => new Date(t.createdAt).getTime())
    .sort((a, b) => b - a)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-800/40 rounded-xl">
            <Building size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">+12%</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalTenants}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('totalTenants')}</p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-5 rounded-xl border border-green-200 dark:border-green-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-green-100 dark:bg-green-800/40 rounded-xl">
            <Users size={22} className="text-green-600 dark:text-green-400" />
          </div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">+8%</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{activeTenants}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('activeTenants')}</p>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-5 rounded-xl border border-amber-200 dark:border-amber-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-800/40 rounded-xl">
            <Package size={22} className="text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">-3%</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{inactiveTenants}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('inActiveTenants')}</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-5 rounded-xl border border-purple-200 dark:border-purple-700/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-800/40 rounded-xl">
            <CreditCard size={22} className="text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">+5%</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{recentCreated ? new Date(recentCreated).toLocaleDateString() : '-'}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('mostRecentCreated')}</p>
      </div>
    </div>
  );
}
