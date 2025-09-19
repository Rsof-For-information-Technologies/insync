'use client';

import DeletePopover from '@/app/shared/delete-popover';
import EyeIcon from '@/components/icons/eye';
import DateCell from '@/components/ui/date-cell';
import { HeaderCell } from '@/components/ui/table';
import { routes } from '@/config/routes';
import { Building, Calendar, Globe, PencilIcon, Phone, Mail, Flag } from 'lucide-react';
import Link from 'next/link';
import { ActionIcon, Text, Tooltip } from 'rizzui';
import { useTranslations } from 'next-intl';

export type OrganizationColumnsParams = {
    sortConfig?: any;
    onDeleteItem: (id: string) => void;
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    locale: string;
};

export const getOrganizationColumns = ({
    sortConfig,
    onDeleteItem,
    onHeaderCellClick,
    locale,
}: OrganizationColumnsParams) => {
    const t = useTranslations('OrganizationPages.organizationListPage.organizationTable.organizationHeader');
    return [
        {
            title: <HeaderCell title={t('organizationId')} />,
            dataIndex: 'id',
            key: 'id',
            width: 250,
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
            title: (
                <HeaderCell
                    title={t('name')}
                    sortable
                    ascending={
                        sortConfig?.direction === 'asc' && sortConfig?.key === 'name'
                    }
                />
            ),
            onHeaderCell: () => onHeaderCellClick('name'),
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <Globe size={18} className="text-green-600 dark:text-green-400" />
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
            title: <HeaderCell title={t('phone')} />,
            dataIndex: 'phone',
            key: 'phone',
            width: 180,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                        <Phone size={18} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <Text className="text-gray-700 dark:text-gray-300">{value || '-'}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('country')} />,
            dataIndex: 'country',
            key: 'country',
            width: 160,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                        <Flag size={18} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <Text className="text-gray-700 dark:text-gray-300">{value || '-'}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title={t('industryType')} />,
            dataIndex: 'industryType',
            key: 'industryType',
            width: 180,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg">
                        <Globe size={18} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <Text className="text-gray-700 dark:text-gray-300">{value || '-'}</Text>
                </div>
            ),
        },
        {
            title: (
                <HeaderCell
                    title={t('createdAt')}
                    sortable
                    ascending={
                        sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
                    }
                />
            ),
            onHeaderCell: () => onHeaderCellClick('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 240,
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
            title: <HeaderCell title={t('isActive')} />,
            dataIndex: 'isActive',
            key: 'isActive',
            width: 140,
            render: (value: boolean) => (
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? t('active') : t('draft')}
                </span>
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
                        <Link href={`/${locale}${routes.organization.organizationDetails(row.id)}`}>
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
                    <Tooltip
                        size="sm"
                        content={'Edit Organization'}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.organization.editOrganization(row.id)}`}>
                            <ActionIcon
                                as="span"
                                size="sm"
                                variant="outline"
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:border-blue-400"
                            >
                                <PencilIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </ActionIcon>
                        </Link>
                    </Tooltip>
                    <DeletePopover
                        title={t('organizationDelete.title')}
                        description={t('organizationDelete.description', { id: row.id })}
                        onDelete={() => onDeleteItem(row.id)}
                    />
                </div>
            ),
        },
    ]
}
