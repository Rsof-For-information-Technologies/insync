'use client';

import EyeIcon from '@/components/icons/eye';
import { HeaderCell } from '@/components/ui/table';
import { routes } from '@/config/routes';
import { Globe, PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { MdOutlineDescription } from "react-icons/md";
import { ActionIcon, Text, Tooltip } from 'rizzui';

export type ProjectColumnsParams = {
    sortConfig?: any;
    onDeleteItem: (id: string) => void;
    onHeaderCellClick: (value: string) => void;
    onChecked?: (id: string) => void;
    locale: string;
};

export const getProjectColumns = ({
    sortConfig,
    onDeleteItem,
    onHeaderCellClick,
    locale,
}: ProjectColumnsParams) => {
    const t = useTranslations('ProjectPages.projectListPage.projectTable.projectHeader');
    return [
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
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <MdOutlineDescription size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        {
            title: (
                <HeaderCell
                    title={t('description')}
                    sortable
                    ascending={
                        sortConfig?.direction === 'asc' && sortConfig?.key === 'description'
                    }
                />
            ),
            onHeaderCell: () => onHeaderCellClick('description'),
            dataIndex: 'description',
            key: 'description',
            width: 300,
            render: (value: string) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <Globe size={18} className="text-green-600 dark:text-green-400" />
                    </div>
                    <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
                </div>
            ),
        },
        // {
        //     title: <HeaderCell title={t('id')} />,
        //     dataIndex: 'id',
        //     key: 'id',
        //     minWidth: 250,
        //     render: (value: string) => (
        //         <div className="flex items-center gap-3">
        //             <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
        //                 <Building size={18} className="text-blue-600 dark:text-blue-400" />
        //             </div>
        //             <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
        //         </div>
        //     ),
        // },
        // {
        //     title: <HeaderCell title={t('organizationId')} />,
        //     dataIndex: 'organizationId',
        //     key: 'organizationId',
        //     minWidth: 250,
        //     render: (value: string) => (
        //         <div className="flex items-center gap-3">
        //             <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
        //                 <Building size={18} className="text-orange-600 dark:text-orange-400" />
        //             </div>
        //             <Text className="font-medium text-gray-800 dark:text-gray-200">{value}</Text>
        //         </div>
        //     ),
        // },
        {
            title: <HeaderCell title={t('isActive')} />,
            dataIndex: 'isActive',
            key: 'isActive',
            width: 200,
            render: (value: boolean) => (
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value ? t('active') : t('inactive')}
                </span>
            ),
        },
        {
            title: <HeaderCell title={t('actions')} className="justify-end" />,
            dataIndex: 'action',
            key: 'action',
            width: 200,
            render: (_: string, row: any) => (
                <div className="flex items-start justify-end gap-3 pe-4">
                    <Tooltip
                        size="sm"
                        content={t('viewTooltip')}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.project.projectDetails(row.id)}`}>
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
                        content={'Edit Project'}
                        placement="top"
                        color="invert"
                    >
                        <Link href={`/${locale}${routes.project.editProject(row.id)}`}>
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
                </div>
            ),
        },
    ]
}
