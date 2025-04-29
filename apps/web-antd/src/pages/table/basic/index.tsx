import type { ColumnDef } from '@tanstack/react-table';

import { ExternalLinkIcon } from '@xpress/icons';
import { cn } from '@xpress/utils';

import { useState } from 'react';

import { DataTable } from '#/components/Table';

export type KeywordItem = {
  cpc: number;
  id: string;
  intents: Array<
    'Commercial' | 'Informational' | 'Navigational' | 'Transactional'
  >;
  keyword: string;
  link: string;
  traffic: number;
  volume: number;
};

export const keywordColumns: ColumnDef<KeywordItem>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    header: 'Keyword',
    accessorKey: 'keyword',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('keyword')}</div>
    ),
  },
  {
    header: 'Intents',
    accessorKey: 'intents',
    cell: ({ row }) => {
      const intents = row.getValue('intents') as string[];
      return (
        <div className="flex gap-1">
          {intents.map((intent) => {
            const styles = {
              Informational: 'bg-indigo-400/20 text-indigo-500',
              Navigational: 'bg-emerald-400/20 text-emerald-500',
              Commercial: 'bg-amber-400/20 text-amber-500',
              Transactional: 'bg-rose-400/20 text-rose-500',
            }[intent];

            return (
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded text-xs font-medium',
                  styles,
                )}
                key={intent}
              >
                {intent.charAt(0)}
              </div>
            );
          })}
        </div>
      );
    },
    enableSorting: false,
    meta: {
      filterVariant: 'select',
    },
    filterFn: (row, id, filterValue) => {
      const rowValue = row.getValue(id);
      return Array.isArray(rowValue) && rowValue.includes(filterValue);
    },
  },
  {
    header: 'Volume',
    accessorKey: 'volume',
    cell: ({ row }) => {
      const volume = Number.parseInt(row.getValue('volume'));
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(volume);
    },
    meta: {
      filterVariant: 'range',
    },
  },
  {
    header: 'CPC',
    accessorKey: 'cpc',
    cell: ({ row }) => <div>${row.getValue('cpc')}</div>,
    meta: {
      filterVariant: 'range',
    },
  },
  {
    header: 'Traffic',
    accessorKey: 'traffic',
    cell: ({ row }) => {
      const traffic = Number.parseInt(row.getValue('traffic'));
      return <div>{traffic}</div>;
    },
    meta: {
      filterVariant: 'range',
    },
  },
  {
    header: 'Link',
    accessorKey: 'link',
    size: 200,
    cell: ({ row }) => (
      <a className="inline-flex items-center gap-1 hover:underline" href="#">
        {row.getValue('link')} <ExternalLinkIcon aria-hidden="true" size={12} />
      </a>
    ),
    enableSorting: false,
  },
];

export const keywordItems: KeywordItem[] = [
  {
    id: '1',
    keyword: 'react components',
    intents: ['Informational', 'Navigational'],
    volume: 2507,
    cpc: 2.5,
    traffic: 88,
    link: 'https://xpress.com',
  },
  {
    id: '2',
    keyword: 'buy react templates',
    intents: ['Commercial', 'Transactional'],
    volume: 1850,
    cpc: 4.75,
    traffic: 65,
    link: 'https://xpress.com/input',
  },
  {
    id: '3',
    keyword: 'react ui library',
    intents: ['Informational', 'Commercial'],
    volume: 3200,
    cpc: 3.25,
    traffic: 112,
    link: 'https://xpress.com/badge',
  },
  {
    id: '4',
    keyword: 'tailwind components download',
    intents: ['Transactional'],
    volume: 890,
    cpc: 1.95,
    traffic: 45,
    link: 'https://xpress.com/alert',
  },
  {
    id: '5',
    keyword: 'react dashboard template free',
    intents: ['Commercial', 'Transactional'],
    volume: 4100,
    cpc: 5.5,
    traffic: 156,
    link: 'https://xpress.com/tabs',
  },
  {
    id: '6',
    keyword: 'how to use react components',
    intents: ['Informational'],
    volume: 1200,
    cpc: 1.25,
    traffic: 42,
    link: 'https://xpress.com/table',
  },
  {
    id: '7',
    keyword: 'react ui kit premium',
    intents: ['Commercial', 'Transactional'],
    volume: 760,
    cpc: 6.8,
    traffic: 28,
    link: 'https://xpress.com/avatar',
  },
  {
    id: '9999',
    keyword: 'react component documentation',
    intents: ['Informational', 'Navigational'],
    volume: 950,
    cpc: 1.8,
    traffic: 35,
    link: 'https://xpress.com',
  },
];

// 示例使用组件
export default function KeywordTableExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div className="p-4">
      <DataTable
        columns={keywordColumns}
        data={keywordItems}
        filterableColumns={['keyword', 'intents', 'volume', 'cpc', 'traffic']}
        fullWidth={true}
        initialSorting={[{ id: 'traffic', desc: false }]}
        onSelectedKeysChange={(keys) => {
          setSelectedKeys(keys as string[]);
        }}
        onSelectionChange={(selectedRowKeys, selectedRows) => {
          console.warn('选中的ID', selectedRowKeys);
          console.warn('选中的数据', selectedRows);
        }}
        selectedKeys={selectedKeys}
        selectKey="id"
        showIndex={true}
        showSelect={true}
        textAlign="center"
      />
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Data table with filters made with{' '}
        <a
          className="hover:text-foreground underline"
          href="https://tanstack.com/table"
          rel="noopener noreferrer"
          target="_blank"
        >
          TanStack Table
        </a>
      </p>
    </div>
  );
}
