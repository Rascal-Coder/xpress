/* eslint-disable unicorn/no-nested-ternary */
import {
  ArrowUpDown,
  ChevronDownIcon,
  ChevronUpIcon,
  SlidersHorizontal,
} from '@xpress/icons';
import { cn } from '@xpress/utils';
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@xpress-core/shadcn-ui';

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'range' | 'select' | 'text';
  }
}

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  filterableColumns?: Array<keyof TData>;
  initialSorting?: SortingState;
  showIndex?: boolean;
  showSelect?: boolean;
  onSelectionChange?: (
    selectedRowKeys: (number | string)[],
    selectedRows: TData[],
  ) => void;
  selectKey?: keyof TData;
  selectedKeys?: (number | string)[];
  onSelectedKeysChange?: (selectedKeys: (number | string)[]) => void;
  fullWidth?: boolean;
  showBorder?: boolean;
  textAlign?: 'center' | 'left' | 'right';
  enableSortingRemoval?: boolean;
  filterRender?: <T extends RowData>(
    column: Column<T, unknown>,
  ) => React.ReactNode;
  tools?: React.ReactNode;
  initialColumnVisibility?: VisibilityState;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  filterableColumns = [],
  initialSorting = [],
  showIndex = true,
  showSelect = false,
  onSelectionChange,
  selectKey = 'index' as keyof TData,
  onSelectedKeysChange,
  fullWidth = false,
  showBorder = true,
  textAlign = 'left',
  enableSortingRemoval = true,
  filterRender,
  tools,
  initialColumnVisibility,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnSizing, setColumnSizing] = useState({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility || {},
  );
  const [columnSearchQuery, setColumnSearchQuery] = useState('');

  // 内置选择列
  const selectColumn: ColumnDef<TData> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
      />
    ),
    size: 48,
    enableSorting: false,
  };

  // 动态插入序号和选择列
  const finalColumns = useMemo(() => {
    let cols = columns;
    if (showIndex) {
      cols = [
        {
          id: 'index',
          header: '序号',
          cell: ({ row }) => row.index + 1,
          size: 48,
          enableSorting: false,
        } as ColumnDef<TData>,
        ...cols,
      ];
    }
    if (showSelect) {
      cols = [selectColumn, ...cols];
    }
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIndex, showSelect, columns]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      columnFilters,
      columnSizing,
      rowSelection,
      columnVisibility,
    },
    onRowSelectionChange: (updater) => {
      const newRowSelection =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(newRowSelection);

      // 使用 selectKey 获取选中行的键
      const selectedRows = data.filter((_, index) => newRowSelection[index]);
      const selectedRowKeys = selectedRows.map(
        (row) => row[selectKey] as number | string,
      );

      if (onSelectionChange) {
        onSelectionChange(selectedRowKeys, selectedRows);
      }

      if (onSelectedKeysChange) {
        onSelectedKeysChange(selectedRowKeys);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval,
    enableColumnResizing: true,
    columnResizeMode: 'onEnd',
    onColumnSizingChange: setColumnSizing,
  });

  // 列选择控制器
  const columnToggle = useMemo(() => {
    const allColumns = table
      .getAllColumns()
      .filter(
        (column) =>
          column.id !== 'select' &&
          (columnSearchQuery === '' ||
            column.columnDef.header
              ?.toString()
              .toLowerCase()
              .includes(columnSearchQuery.toLowerCase())),
      );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-2 h-7 w-7 p-0" size="sm" variant="outline">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2">
          <div className="space-y-2">
            <h4 className="font-medium">显示列</h4>
            <Input
              className="mb-2 h-8"
              onChange={(e) => setColumnSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="搜索列..."
              value={columnSearchQuery}
            />
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {allColumns.map((column) => {
                // 检查列是否有header属性
                const header = column.columnDef.header?.toString() || column.id;

                return (
                  <div
                    className="flex items-center space-x-2"
                    key={column.id}
                    onClick={(e) => {
                      // 防止事件冒泡到父元素
                      e.stopPropagation();
                    }}
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                      id={`column-${column.id}`}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value);
                      }}
                    />
                    <label
                      className="flex-1 cursor-pointer truncate text-sm"
                      htmlFor={`column-${column.id}`}
                      onClick={(e) => {
                        // 确保点击label也能切换复选框状态
                        e.preventDefault();
                        e.stopPropagation();
                        column.toggleVisibility(!column.getIsVisible());
                      }}
                    >
                      {header}
                    </label>
                  </div>
                );
              })}
            </div>
            <div
              className="flex justify-between border-t pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  table.toggleAllColumnsVisible(false);
                }}
                size="sm"
                variant="outline"
              >
                全部隐藏
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  table.toggleAllColumnsVisible(true);
                }}
                size="sm"
                variant="outline"
              >
                全部显示
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [table, columnSearchQuery]);

  return (
    <div
      className="space-y-2 transition-colors duration-200"
      style={{ position: 'relative' }}
    >
      {/* 顶部工具栏和过滤器区域 */}
      <div className="flex items-center justify-between">
        {/* 过滤器区域 */}
        {filterableColumns.length > 0 && filterRender ? (
          <div className="flex flex-wrap gap-3">
            {filterableColumns.map((columnName) => {
              const column = table.getColumn(columnName as string);
              if (!column) return null;
              return (
                <div className="w-36" key={columnName as string}>
                  {filterRender(column)}
                </div>
              );
            })}
          </div>
        ) : (
          <div></div> /* 左侧没有过滤器时占位，确保工具栏在右侧 */
        )}

        {/* 工具栏区域 - 固定在右上角 */}
        <div className="flex items-center gap-2">
          {tools}
          {columnToggle}
        </div>
      </div>

      <div className="rounded-md border transition-colors duration-200">
        <Table
          className="table-fixed transition-colors duration-200"
          style={{
            width: fullWidth ? '100%' : table.getCenterTotalSize(),
          }}
        >
          <TableHeader className="transition-colors duration-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-muted/50 transition-colors duration-200"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                      }
                      className={cn(
                        'relative h-10 select-none border-r transition-colors duration-200',
                        showBorder && 'border',
                        textAlign === 'center' && 'text-center',
                        textAlign === 'right' && 'text-right',
                      )}
                      key={header.id}
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      <div className="relative flex h-full w-full items-center transition-colors duration-200">
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'flex h-full w-full items-center transition-colors duration-200',
                              header.column.getCanSort() &&
                                'cursor-pointer select-none gap-2',
                              !header.column.getCanSort() &&
                                textAlign === 'center' &&
                                'justify-center',
                              !header.column.getCanSort() &&
                                textAlign === 'right' &&
                                'justify-end',
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              // Enhanced keyboard handling for sorting
                              if (
                                header.column.getCanSort() &&
                                (e.key === 'Enter' || e.key === ' ')
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            <div
                              className={cn(
                                'flex items-center gap-2 truncate transition-colors duration-200',
                                header.column.getCanSort() &&
                                  textAlign === 'center' &&
                                  'mx-auto',
                                header.column.getCanSort() &&
                                  textAlign === 'right' &&
                                  'ml-auto',
                              )}
                            >
                              <div className="truncate">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </div>
                              {header.column.getCanSort() && (
                                <>
                                  {{
                                    asc: (
                                      <ChevronUpIcon
                                        aria-hidden="true"
                                        className="shrink-0 opacity-60"
                                        size={16}
                                      />
                                    ),
                                    desc: (
                                      <ChevronDownIcon
                                        aria-hidden="true"
                                        className="shrink-0 opacity-60"
                                        size={16}
                                      />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <ArrowUpDown
                                      aria-hidden="true"
                                      className="shrink-0 opacity-60"
                                      size={16}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: cn(
                              'absolute top-0 right-0 h-full w-1.5 cursor-col-resize user-select-none touch-none z-10 transition-colors duration-200',
                              header.column.getIsResizing()
                                ? 'bg-primary opacity-100'
                                : 'bg-muted/50 hover:bg-primary/70 hover:opacity-100 opacity-0',
                            ),
                            style: {
                              transform:
                                table.options.columnResizeMode === 'onEnd' &&
                                header.column.getIsResizing()
                                  ? `translateX(${
                                      table.getState().columnSizingInfo
                                        .deltaOffset ?? 0
                                    }px)`
                                  : '',
                            },
                          }}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="transition-colors duration-200">
            {table.getRowModel().rows?.length &&
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="transition-colors duration-200"
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(
                        'truncate transition-colors duration-200',
                        showBorder && 'border',
                        textAlign === 'center' && 'text-center',
                        textAlign === 'right' && 'text-right',
                      )}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {(!table.getRowModel().rows ||
              table.getRowModel().rows.length === 0) && (
              <TableRow className="duration-60 transition-colors">
                <TableCell
                  className={cn(
                    'duration-60 h-24 text-center transition-colors',
                    showBorder && 'border',
                  )}
                  colSpan={finalColumns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
