'use client';

import { HeaderCell } from '@/components/ui/table';
import { Tooltip, ActionIcon } from 'rizzui';
import Link from "next/link";
import { Trash2, Download} from 'lucide-react';
import { Switch } from "rizzui";
import UpdateChatbotInfo from '@/app/[locale]/chatbot/(components)/updateChatbotInfo';

export type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

export type ChatbotColumns = {
  sortConfig?: SortConfig;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  data?: unknown[];
  checkedItems?: string[];
  handleSelectAll?: () => void;
  onChecked?: (id: string) => void;
  locale?: string;
};

interface ChatbotRow {
  id: string;
  name: string;
  keywords: string[];
  isActive: boolean;
  [key: string]: unknown;
}

export const getChatbotColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
}: ChatbotColumns) => {
  return [
    {
      title: (
        <HeaderCell
          title="Name"
          sortable
          ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'name'}
        />
      ),
      onHeaderCell: () => onHeaderCellClick('name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (value: string, record: ChatbotRow) => (
        <div className="flex items-center gap-2">
          <Link
            href={`chatbot/chatbotView/${record.id}`}
            className="font-medium text-black"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Keywords" />,
      dataIndex: 'keywords',
      key: 'keywords',
      width: 250,
      render: (value: string[]) => (
        <div className='flex '>
          {value && value.length > 0 ?
            value.map((keyword, index) =>
              <span className='mr-[5px] text-blue-600 font-medium items-center flex w-[min-content] rounded-3xl h-[28px] px-[8px] border border-gray-200 ' key={index}>{keyword}</span>
            )
            : '-'
          }
        </div>
      ),
    },
    {
      title: <HeaderCell title="Is Active" />,
      dataIndex: "isActive",
      key: "isActive",
      width: 140,
      render: (value: boolean, record: ChatbotRow) => {
        return (
          <Switch
            defaultChecked={value}
            onChange={(e) => {
              const checked = e.target.checked;
              console.log("Switch toggled:", checked, "for record:", record);
            }}
          />
        );
      },
    },
    {
      title: <HeaderCell title="Actions" className="justify-end" />,
      dataIndex: 'action',
      key: 'action',
      width: 220,
      render: (_: string, row: ChatbotRow) => (
        <div className="flex items-center justify-end gap-3 pe-4">
          <UpdateChatbotInfo data={row.id} name={row.name} keywords={Array.isArray(row.keyword) ? row.keyword : []} />
          <Tooltip size="sm" content="Delete" placement="top" color="invert">
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              onClick={() => onDeleteItem(row.id)}
              className="hover:bg-red-50 dark:hover:bg-red-900/30 border-red-300 dark:border-red-700 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </ActionIcon>
          </Tooltip>
          <Tooltip size="sm" content="Download" placement="top" color="invert">
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              className="hover:bg-green-50 dark:hover:bg-green-900/30 border-green-300 dark:border-green-700 hover:border-green-400"
            >
              <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
            </ActionIcon>
          </Tooltip>
        </div>
      ),
    },
  ];
};