import { getAllOrganizationsByTenantId, getTenantById } from "@/apiCalls/tenant/tenantApis";
import { getOrganizationByTenantIdColumns } from "@/app/shared/table-list/organizationByTenantIdColumns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import type { GetTenantsByIdResponse } from "@/types/tenant/getTenantById";
import { Building, Hash } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Header from "../../(components)/CommonHeader";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

export const metadata: Metadata = {
    title: "Tenant Management",
};

export default async function DetailsTenant({ params }: { params: { tenantId: string } }) {
    const t = await getTranslations('TenantPages.tenantDetailPage')
    const { tenantId } = params;
    const { data: getOrganizations } = await getAllOrganizationsByTenantId({ id: tenantId });
    const { data: tenantsData }: GetTenantsByIdResponse = await getTenantById({ id: tenantId });
    console.log("tenantsData:", tenantsData);
    const columns = getOrganizationByTenantIdColumns;

    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="flex flex-col space-y-6">
                    <Header title={t('title')} description={t('description')} />
                    <CollapsibleSection title={t('tenantDetails.title')} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Hash size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.id')}</h6>
                                </div>
                                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{tenantsData.id}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                        <Building size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.name')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{tenantsData.name}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                        <Building size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.domain')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{tenantsData.domain}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${tenantsData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.status')}</h6>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${tenantsData.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'} pl-11`}>
                                    {tenantsData.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            {/* <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                            <Building size={20} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.rowVersion')}</h6>
                                    </div>
                                    <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{tenantsData.rowVersion}</p>
                                </div> */}

                            {/* <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                            <Building size={20} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.domainEvents')}</h6>
                                    </div>
                                    <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{tenantsData.domainEvents}</p>
                                </div> */}

                            {/* <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                            <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
                                        </div>
                                        <h6 className="font-semibold text-gray-800 dark:text-white">{t('tenantDetails.updatedAt')}</h6>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-600 pl-11">
                                        <Calendar size={16} />
                                        <span>{tenant.updatedAt ? new Date(tenant.updatedAt).toLocaleDateString() : '-'}</span>
                                        <Clock size={16} className="ml-2" />
                                        <span>{tenant.updatedAt ? new Date(tenant.updatedAt).toLocaleTimeString() : '-'}</span>
                                    </div>
                                </div> */}
                        </div>
                    </CollapsibleSection>
                </div>
                <div className="flex flex-col space-y-6 mt-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <BasicTableWidget
                            title={t('organizationTable.title')}
                            variant="minimal"
                            data={getOrganizations ? getOrganizations : []}
                            getColumns={columns}
                            enablePagination
                            searchPlaceholder={t('organizationTable.searchPlaceholder')}
                            className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
                        />
                    </div>
                </div>
            </Authorize>
        </Authenticate>
    );
}
