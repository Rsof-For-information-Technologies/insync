'use client';

import Link from 'next/link';
import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { routes } from '@/config/routes';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import { HeaderCell } from '@/components/ui/table';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { propertyStatuses } from '@/constants/constants';
import { useParams } from 'next/navigation';
import { Params } from "@/types/params";
import { useTranslations } from 'next-intl';
import cn from '@/utils/class-names';

type Columns = {
  sortConfig?: any;
  onDeleteProperty: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};


// const onDeleteProperty = async (id: string | number) => {
//   try {
//     const response = await deleteProperty(id)
//     if (response.succeeded) {
//       toast.success('Property deleted successfully');
//       window.location.reload();
//       console.log('Property deleted successfully:', response);
//     } else {
//       toast.error('Failed to delete property');
//       console.error('Failed to delete property:', response);
//     }
//   } catch (error) {
//     console.error('Error deleting property:', error);
//   }
// }

// property columns
// export const getPropertyColumns = ({
//   sortConfig,
//   onHeaderCellClick,

// }: Columns) => {
//   const { locale } = useParams<Params>()
//   const { propertyTypes, fetchStaticData } = useStaticDataStore();
//   const t = useTranslations('PropertyPages.propertyListPage.propertyTable.propertyHeader');

//   useEffect(() => {
//     fetchStaticData();
//   }, [fetchStaticData]);

//   const propertyTypeOptions = propertyTypes.map(type => ({
//     label: type.displayName,
//     value: type.value
//   }));

//   return [
//     {
//       title: <HeaderCell title={t('id')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
//       onHeaderCell: () => onHeaderCellClick('id'),
//       dataIndex: 'id',
//       key: 'id',
//       minWidth: 100,
//       render: (value: number) => <Text>#{value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('title')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'title'} />,
//       onHeaderCell: () => onHeaderCellClick('title'),
//       dataIndex: 'title',
//       key: 'title',
//       minWidth: 300,
//       render: (value: string) => <Text>{value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('price')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'price'} />,
//       onHeaderCell: () => onHeaderCellClick('price'),
//       dataIndex: 'price',
//       key: 'price',
//       minWidth: 100,
//       render: (value: number) => <Text>${value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('city')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'city'} />,
//       onHeaderCell: () => onHeaderCellClick('city'),
//       dataIndex: 'city',
//       key: 'city',
//       minWidth: 120,
//       render: (value: string) => <Text>{value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('location')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'location'} />,
//       onHeaderCell: () => onHeaderCellClick('location'),
//       dataIndex: 'location',
//       key: 'location',
//       minWidth: 180,
//       render: (value: string) => <Text>{value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('areaSize')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'areaSize'} />,
//       onHeaderCell: () => onHeaderCellClick('areaSize'),
//       dataIndex: 'areaSize',
//       key: 'areaSize',
//       minWidth: 120,
//       render: (value: number) => <Text>{value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('bedrooms')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'bedrooms'} />,
//       onHeaderCell: () => onHeaderCellClick('bedrooms'),
//       dataIndex: 'bedrooms',
//       key: 'bedrooms',
//       minWidth: 80,
//       render: (value: number) => <Text>{value}</Text>,
//     },
//     {
//       title: <HeaderCell title={t('bathrooms')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'bathrooms'} />,
//       onHeaderCell: () => onHeaderCellClick('bathrooms'),
//       dataIndex: 'bathrooms',
//       key: 'bathrooms',
//       minWidth: 80,
//       render: (value: number) => <Text>{value}</Text>,
//     },
//     {
//       title: (<HeaderCell title={t('status')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} />),
//       dataIndex: 'status',
//       key: 'status',
//       minWidth: 120,
//       render: (value: number) => {
//         const status = propertyStatuses.find((s) => s.value === value);
//         let color: "warning" | "success" | "info" | "danger" | "secondary" = "secondary";
//         switch (value) {
//           case 0: color = "warning"; break;
//           case 1: color = "success"; break;
//           case 2: color = "danger"; break;
//           case 3: color = "info"; break;
//           case 4: color = "secondary"; break;
//           default: color = "secondary";
//         }
//         return (
//           <Badge color={color} className="min-w-[80px] text-center">
//             {status?.label ?? "Unknown"}
//           </Badge>
//         );
//       },
//     },
//     {
//       title: <HeaderCell title={t('propertyType')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'propertyType'} />,
//       onHeaderCell: () => onHeaderCellClick('propertyType'),
//       dataIndex: 'propertyType',
//       key: 'propertyType',
//       minWidth: 180,
//       render: (value: number) => {
//         const type = propertyTypeOptions.find((t) => t.value === value);
//         return <Text>{type?.label ?? "Unknown"}</Text>;
//       },
//     },
//     {
//       title: <HeaderCell title={t('expiryDate')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'expiryDate'} />,
//       onHeaderCell: () => onHeaderCellClick('expiryDate'),
//       dataIndex: 'expiryDate',
//       key: 'expiryDate',
//       minWidth: 180,
//       render: (_: string | null, row: any) => <ExpiryDateDuration row={row} />,
//     },
//     {
//       title: <HeaderCell title={t('investorOnly')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isInvestorOnly'} />,
//       onHeaderCell: () => onHeaderCellClick('isInvestorOnly'),
//       dataIndex: 'isInvestorOnly',
//       key: 'isInvestorOnly',
//       minWidth: 180,
//       render: (value: boolean) => value ? <Badge color="info">Yes</Badge> : <Badge color="secondary">No</Badge>,
//     },
//     {
//       title: <HeaderCell title={t('actions')} className='flex justify-end' />,
//       dataIndex: 'action',
//       key: 'action',
//       minWidth: 50,
//       render: (_: string, row: any) => {

//         const status = propertyStatuses.find((s) => s.value === row.status);

//         let nextStatusValue: number | undefined;
//         if (row.status === 0) nextStatusValue = 1;
//         else if (row.status === 1) nextStatusValue = 2;
//         else if (row.status === 2) nextStatusValue = 3;
//         else if (row.status === 3) nextStatusValue = 4;
//         else if (row.status === 4) nextStatusValue = undefined

//         const allowedStatuses = typeof nextStatusValue === "number"
//           ? propertyStatuses.filter(s => s.value === nextStatusValue)
//           : [];

//         return (
//           <div className="flex items-center justify-end gap-3">
//             <div className="relative">
//               <select
//                 value={row.status}
//                 onChange={async (e) => {
//                   const newStatus = Number(e.target.value);
//                   try {
//                     const response = await PropertyUpdateStatus(row.id, newStatus);
//                     if (response.succeeded) {
//                       toast.success(t('propertyToast.statusUpdated'));
//                     } else {
//                       toast.error(t('propertyToast.statusUpdateFailed', { message: response.message }));
//                       console.error('Failed to update status:', response);
//                     }
//                   } catch (error) {
//                     console.error('Failed to update status', error);
//                   }
//                 }}
//                 className={cn("appearance-none h-[29px] border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition shadow-sm hover:border-primary-500 dark:border-gray-500 dark:bg-gray-100 dark:text-gray-500", locale === 'ar' ? "text-right" : "text-left")} style={{ minWidth: 110, cursor: 'pointer' }} >
//                 <option value={row.status} disabled>
//                   {status?.label}
//                 </option>
//                 {allowedStatuses.map((s) => (
//                   <option key={s.value} value={s.value}>
//                     {s.label}
//                   </option>
//                 ))}
//               </select>
//               {/* <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
//                 <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
//               </span> */}
//             </div>
//             <Tooltip size="sm" content={t('editTooltip')} placement="top" color="invert">
//               <Link href={`/${locale}${routes.property.editProperty(row.id)}`}>
//                 <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
//                   <PencilIcon className="h-4 w-4" />
//                 </ActionIcon>
//               </Link>
//             </Tooltip>
//             <Tooltip size="sm" content={t('viewTooltip')} placement="top" color="invert">
//               <Link href={`/${locale}${routes.property.propertyDetails(row.id)}`}>
//                 <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
//                   <EyeIcon className="h-4 w-4" />
//                 </ActionIcon>
//               </Link>
//             </Tooltip>
//             <DeletePopover
//               title={t('propertyDelete.title')}
//               description={t('propertyDelete.description', { id: row.id })}
//               onDelete={() => onDeleteProperty(row.id)}
//             />
//           </div>
//         );
//       },
//     },
//   ];
// }
