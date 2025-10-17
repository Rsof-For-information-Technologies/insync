'use client';

import EyeIcon from '@/components/icons/eye';
import DateCell from '@/components/ui/date-cell';
import { HeaderCell } from '@/components/ui/table';
import { routes } from '@/config/routes';
import { Building, Calendar, Globe, Mail, PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ActionIcon, Text, Tooltip } from 'rizzui';
import { UserSwitch } from './(components)/userSwitch';

export type UserColumnsParams = {
    sortConfig?: any;
    onDeleteItem: (id: string) => void;
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    locale: string;
};

export const getUserColumns = ({
    sortConfig,
    onDeleteItem,
    onHeaderCellClick,
    locale,
}: UserColumnsParams) => {
    const t = useTranslations('UserPages.userListPage.userTable.userHeader');
    return [
        {
            title: <HeaderCell title={t('id')} />,
            dataIndex: 'id',
            key: 'id',
            minWidth: 250,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Building size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('tenantId')} />,
            dataIndex: 'tenantId',
            key: 'tenantId',
            minWidth: 250,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <Globe size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('organizationId')} />,
            dataIndex: 'organizationId',
            key: 'organizationId',
            minWidth: 250,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                        <Building size={18} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('email')} />,
            dataIndex: 'email',
            key: 'email',
            width: 220,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                        <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <Text className="text-gray-700 dark:text-gray-300">{value || '-'}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('isActive')} />,
            dataIndex: 'isActive',
            key: 'isActive',
            minWidth: 140,
            render: (_: boolean, row: any) => <UserSwitch row={row} field="isActive" />,
        },
        {
            title: <HeaderCell title={t('isInvitationSent')} />,
            dataIndex: 'isInvitationSent',
            key: 'isInvitationSent',
            minWidth: 140,
            render: (_: boolean, row: any) => <UserSwitch row={row} field="isInvitationSent" />,
        },
        {
            title: <HeaderCell title={t('isInvitationAccepted')} />,
            dataIndex: 'isInvitationAccepted',
            key: 'isInvitationAccepted',
            minWidth: 180,
            render: (_: boolean, row: any) => <UserSwitch row={row} field="isInvitationAccept" />,
        },
        {
            title: <HeaderCell title={t('actions')} className="justify-end" />,
            dataIndex: 'action',
            key: 'action',
            width: 220,
            render: (_: string, row: any) => (
                <div className="flex items-start justify-end gap-3 pe-4">
                    <Tooltip
                        size="sm"
                        content={t('viewTooltip')}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.user.userDetails(row.id)}`}>
                            <ActionIcon
                                as="span"
                                size="sm"
                                variant="outline"
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400"
                            >
                                <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </ActionIcon>
                        </Link>
                    </Tooltip>
                    {/* <Tooltip
                        size="sm"
                        content={'Edit User'}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.user.editUser(row.id)}`}>
                            <ActionIcon
                                as="span"
                                size="sm"
                                variant="outline"
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:border-blue-400"
                            >
                                <PencilIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </ActionIcon>
                        </Link>
                    </Tooltip> */}
                    {/* <DeletePopover
                        title={t('organizationDelete.title')}
                        description={t('organizationDelete.description', { id: row.id })}
                        onDelete={() => onDeleteItem(row.id)}
                    /> */}
                </div>
            ),
        },
    ]
}
