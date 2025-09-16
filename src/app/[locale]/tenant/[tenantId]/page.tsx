import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { ArrowLeft, Building, Calendar, Clock, Hash, RefreshCw } from "lucide-react";
import { getTranslations } from "next-intl/server";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Header from "../../(components)/CommonHeader";
import { getTenantById } from "@/apiCalls/tenant/tenantApis";
import type { TenantById } from "@/types/tenant/getTenantById";

export default async function DetailsTenant({ params }: { params: { tenantId: string } }) {
    const t = await getTranslations('TenantPages.tenantDetailPage')
    const { tenantId } = params;

    const tenant: TenantById = await getTenantById(tenantId);

    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="flex flex-col space-y-6">
                    {/* Header Section */}
                    <Header title={t('title')} description={t('description')} />

                    <CollapsibleSection title={t('tenantDetails.title')} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Hash size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.id')}</h6>
                                </div>
                                <p className="text-lg font-mono text-gray-700 dark:text-gray-300 pl-11">{tenant.id}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                        <Building size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.name')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-300 pl-11">{tenant.name}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${tenant.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.status')}</h6>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${tenant.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'} pl-11`}>
                                    {tenant.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                                        <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.createdAt')}</h6>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 pl-11">
                                    <Calendar size={16} />
                                    <span>{new Date(tenant.createdAt).toLocaleDateString()}</span>
                                    <Clock size={16} className="ml-2" />
                                    <span>{new Date(tenant.createdAt).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.updatedAt')}</h6>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 pl-11">
                                    <Calendar size={16} />
                                    <span>{tenant.updatedAt ? new Date(tenant.updatedAt).toLocaleDateString() : '-'}</span>
                                    <Clock size={16} className="ml-2" />
                                    <span>{tenant.updatedAt ? new Date(tenant.updatedAt).toLocaleTimeString() : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </CollapsibleSection>
                </div>
            </Authorize>
        </Authenticate>
    );
}
