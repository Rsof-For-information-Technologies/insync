'use client';

import DeletePopover from '@/app/shared/delete-popover';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import DateCell from '@/components/ui/date-cell';
import { HeaderCell } from '@/components/ui/table';
import { routes } from '@/config/routes';
import { Building, Calendar, Globe, Users } from 'lucide-react';
import Link from 'next/link';
import { ActionIcon, Badge, Text, Tooltip } from 'rizzui';
import { TenantSwitch } from './(components)/tenantSwitch';

export type TenantColumnsParams = {
    sortConfig?: any;
    onDeleteItem: (id: string) => void;
    onHeaderCellClick: (value: string) => void;
    onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    locale: string;
};

export const getTenantColumns = ({
    sortConfig,
    onDeleteItem,
    onHeaderCellClick,
    locale,
}: TenantColumnsParams) => [
        {
            title: <HeaderCell title="Tenant ID" />,
            dataIndex: 'id',
            key: 'id',
            width: 220,
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
                    title="Name"
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
                        <Users size={18} className="text-green-600 dark:text-green-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        {
            title: <HeaderCell title="Domain" />,
            dataIndex: 'domain',
            key: 'domain',
            width: 200,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                        <Globe size={18} className="text-pink-600 dark:text-pink-400" />
                    </div>
                    <Text className="text-gray-700 dark:text-gray-300">{value || '-'}</Text>
                </div>
            ),
        },
        {
            title: (
                <HeaderCell
                    title="Created"
                    sortable
                    ascending={
                        sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
                    }
                />
            ),
            onHeaderCell: () => onHeaderCellClick('createdAt'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 200,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                        <Calendar size={18} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <DateCell date={new Date(value)} className="text-gray-700 dark:text-gray-300" />
                </div>
            ),
        },
        // {
        //     title: <HeaderCell title="Status" />,
        //     dataIndex: 'isActive',
        //     key: 'isActive',
        //     width: 200,
        //     render: (value: boolean, row: any) => (
        //         <div className="flex items-center gap-3">
        //             <TenantSwitch row={row}/>
        //         </div>
        //     ),
        // },
        {
            title: <HeaderCell title="Actions" className="justify-end" />,
            dataIndex: 'action',
            key: 'action',
            width: 220,
            render: (_: string, row: any) => (
                <div className="flex items-start justify-end gap-3 pe-4">
                    <TenantSwitch row={row} />
                    <Tooltip
                        size="sm"
                        content={'View Tenant'}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.tenant.tenantDetails(row.id)}`}>
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
                        content={'Edit Tenant'}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.tenant.editTenant(row.id)}`}>
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
                    <DeletePopover
                        title={`Delete the tenant`}
                        description={`Are you sure you want to delete tenant #${row.id}? This action cannot be undone.`}
                        onDelete={() => onDeleteItem(row.id)}
                    />
                </div>
            ),
        },
    ];