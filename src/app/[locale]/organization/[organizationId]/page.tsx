import { getAllUsersByOrganizationId, getOrganizationById } from "@/apiCalls/organization/organizationApis";
import { getUserByOrganizationIdColumns } from "@/app/shared/table-list/userByOrganizationIdColumns";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { OrganizationByIdResponse } from "@/types/organization/getOrganizationById";
import { UserByOrganizationIdResponse } from "@/types/user/getUsersByOrganizationId";
import { UserRole } from "@/types/userRoles";
import { Building, Hash, Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Header from "../../(components)/CommonHeader";

export const metadata: Metadata = {
    title: "Organization Management",
};

export default async function DetailsOrganization({ params }: { params: { organizationId: string } }) {
    const t = await getTranslations('OrganizationPages.organizationDetailPage')
    console.log(params)
    const { organizationId } = params;
    const { data: getUsers }: UserByOrganizationIdResponse = await getAllUsersByOrganizationId({ organizationId: organizationId });
    const { data: organization }: OrganizationByIdResponse = await getOrganizationById({ id: organizationId });
    const columns = getUserByOrganizationIdColumns;

    return (
        <Authenticate >
            <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
                <div className="flex flex-col space-y-6">
                    <Header title={t('title')} description={t('description')} />
                    <CollapsibleSection title={t('organizationDetails.title')} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Hash size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.id')}</h6>
                                </div>
                                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{organization.id}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Hash size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.tenantId')}</h6>
                                </div>
                                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{organization.tenantId}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Hash size={20} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.industryType')}</h6>
                                </div>
                                <p className="text-lg font-mono text-gray-700 dark:text-gray-600 pl-11">{organization.industryType}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                        <Building size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.name')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{organization.name}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                                        <Mail size={20} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.email')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{organization.email || '-'}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                                        <Phone size={20} className="text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.phone')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{organization.phone || '-'}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg">
                                        <MapPin size={20} className="text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.country')}</h6>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-600 pl-11">{organization.country || '-'}</p>
                            </div>

                            <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${organization.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    </div>
                                    <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.status')}</h6>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${organization.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'} pl-11`}>
                                    {organization.isActive ? t('active') : t('inactive')}
                                </span>
                            </div>

                            {/* <div className="flex flex-col p-5 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-100 border border-gray-200 dark:border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
                                </div>
                                <h6 className="font-semibold text-gray-800 dark:text-white">{t('organizationDetails.updatedAt')}</h6>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-600 pl-11">
                                <Calendar size={16} />
                                <span>{organization.updatedAt ? new Date(organization.updatedAt).toLocaleDateString() : '-'}</span>
                                <Clock size={16} className="ml-2" />
                                <span>{organization.updatedAt ? new Date(organization.updatedAt).toLocaleTimeString() : '-'}</span>
                            </div>
                        </div> */}
                        </div>
                    </CollapsibleSection>
                </div>
                <div className="flex flex-col space-y-6 mt-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <BasicTableWidget
                            title={t('userTable.title')}
                            variant="minimal"
                            data={getUsers ? getUsers : []}
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
