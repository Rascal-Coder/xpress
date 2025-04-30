import type { ColumnDef } from '@tanstack/react-table';

import { ExternalLinkIcon, Maximize, Minimize, RotateCw } from '@xpress/icons';
import { cn } from '@xpress/utils';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@xpress-core/shadcn-ui';

import { useCallback, useMemo, useState } from 'react';

import Pagination from '#/components/Pagination';
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

// 生成大量模拟数据，用于测试分页
const generateMockData = (count: number): KeywordItem[] => {
  type Intent =
    | 'Commercial'
    | 'Informational'
    | 'Navigational'
    | 'Transactional';
  const intentions: Intent[] = [
    'Commercial',
    'Informational',
    'Navigational',
    'Transactional',
  ];
  const mockData: KeywordItem[] = [];

  for (let i = 1; i <= count; i++) {
    // 随机生成1-3个意图
    const intentCount = Math.floor(Math.random() * 3) + 1;
    const randomIntents: Intent[] = [];

    // 确保至少有一个意图
    while (randomIntents.length < intentCount) {
      const randomIndex = Math.floor(Math.random() * intentions.length);
      const randomIntent = intentions[randomIndex];
      // 由于我们直接从固定数组中选择，这里的randomIntent一定是有值的
      if (randomIntent && !randomIntents.includes(randomIntent)) {
        randomIntents.push(randomIntent);
      }
    }

    mockData.push({
      id: i.toString(),
      keyword: `测试关键词 ${i}`,
      intents: randomIntents,
      volume: Math.floor(Math.random() * 10_000) + 500,
      cpc: +(Math.random() * 10 + 0.5).toFixed(2),
      traffic: Math.floor(Math.random() * 200) + 10,
      link: `https://xpress.com/item-${i}`,
    });
  }

  return mockData;
};

// 生成100条模拟数据 - 使用useMemo来避免每次渲染重新生成
const generateMockDataOnce = () => generateMockData(100);

// 示例使用组件
export default function KeywordTableExample() {
  // 使用useMemo来缓存关键词数据，确保它们不会在组件重新渲染时重新生成
  const keywordItems = useMemo(() => generateMockDataOnce(), []);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 使用useMemo计算总页数，避免不必要的重新计算
  const totalPages = useMemo(
    () => Math.ceil(keywordItems.length / rowsPerPage),
    [keywordItems.length, rowsPerPage],
  );

  // 使用useMemo获取当前页的数据，只有当依赖变化时才会重新计算
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return keywordItems.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, keywordItems]);

  // 使用useCallback处理每页行数变化，避免不必要的函数重新创建
  const handleRowsPerPageChange = useCallback((value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1); // 重置到第一页
  }, []);

  // 添加页码变化处理函数
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);

    // 可以选择性地更新URL，但不依赖它来触发状态更新
    window.history.replaceState(null, '', `#/page/${page}`);
  }, []);

  // 使用useCallback处理选择变化，避免不必要的函数重新创建
  const handleSelectedKeysChange = useCallback((keys: unknown[]) => {
    setSelectedKeys(keys as string[]);
  }, []);

  // 刷新数据的处理函数
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // 切换扩展/收缩状态
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // 工具栏按钮
  const toolbarButtons = useMemo(
    () => (
      <TooltipProvider>
        <div className="bg-background flex items-center gap-2 rounded-md border p-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7 p-0"
                disabled={isLoading}
                onClick={handleRefresh}
                size="sm"
                variant="ghost"
              >
                <RotateCw
                  className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="bottom" sideOffset={5}>
              {isLoading ? '刷新中...' : '刷新数据'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7 p-0"
                onClick={toggleExpanded}
                size="sm"
                variant="ghost"
              >
                {isExpanded ? (
                  <Minimize className="h-3.5 w-3.5" />
                ) : (
                  <Maximize className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="bottom" sideOffset={5}>
              {isExpanded ? '收缩表格' : '扩展表格'}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    ),
    [handleRefresh, isExpanded, isLoading, toggleExpanded],
  );

  return (
    <div
      className={cn(
        'bg-card p-4 transition-all',
        isExpanded && 'fixed inset-0 z-50 m-4 overflow-auto rounded-lg',
      )}
    >
      <DataTable
        columns={keywordColumns}
        data={currentPageData}
        fullWidth={true}
        initialSorting={[{ id: 'traffic', desc: false }]}
        onSelectedKeysChange={handleSelectedKeysChange}
        selectedKeys={selectedKeys}
        selectKey="id"
        showIndex={true}
        showSelect={true}
        textAlign="center"
        tools={toolbarButtons}
      />
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          paginationItemsToDisplay={5}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          total={keywordItems.length}
          totalPages={totalPages}
        />
      </div>
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
