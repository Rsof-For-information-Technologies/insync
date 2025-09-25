'use client';

import EyeIcon from '@/components/icons/eye';
import DateCell from '@/components/ui/date-cell';
import { HeaderCell } from '@/components/ui/table';
import { routes } from '@/config/routes';
import { Building, Calendar, Flag, Globe, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ActionIcon, Text, Tooltip } from 'rizzui';

export type UserByOrganizationIdColumnsParams = {
    sortConfig?: any;
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    locale: string;
};

export const getUserByOrganizationIdColumns = ({
    sortConfig,
    onHeaderCellClick,
    locale,
}: UserByOrganizationIdColumnsParams) => {
    const t = useTranslations('OrganizationPages.organizationDetailPage.userTable.userHeader');
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
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Building size={18} className="text-blue-600 dark:text-blue-400" />
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
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Building size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('userId')} />,
            dataIndex: 'userId',
            key: 'userId',
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
            title: <HeaderCell title={t('email')} />,
            dataIndex: 'email',
            key: 'email',
            minWidth: 220,
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
            minWidth: 100,
            render: (value: boolean) => (
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? t('active') : t('inactive')}
                </span>
            ),
        },
               {
            title: <HeaderCell title={t('isInvitationSent')} />,
            dataIndex: 'isInvitationSent',
            key: 'isInvitationSent',
            minWidth: 200,
            render: (value: boolean) => (
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? t('send') : t('resend')}
                </span>
            ),
        },
               {
            title: <HeaderCell title={t('isInvitationAccept')} />,
            dataIndex: 'isInvitationAccept',
            key: 'isInvitationAccept',
            minWidth: 200,
            render: (value: boolean) => (
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? t('accepted') : t('pending')}
                </span>
            ),
        },
        {
            title: (
                <HeaderCell
                    title={t('createdAt')}
                    sortable
                    ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'}
                />
            ),
            onHeaderCell: () => onHeaderCellClick('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            minWidth: 200,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                        <Calendar size={18} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <DateCell date={new Date(value)} className="text-gray-700 dark:text-gray-300" />
                </div>
            ),
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
                </div>
            ),
        },
    ]
}
