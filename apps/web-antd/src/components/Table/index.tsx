/* eslint-disable unicorn/no-nested-ternary */
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@xpress/icons';
import { cn } from '@xpress/utils';
import {
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
} from '@tanstack/react-table';
import { useId, useMemo, useState } from 'react';

declare module '@tanstack/react-table' {
  // allows us to define custom properties for our columns
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'range' | 'select' | 'text';
  }
}

// 表格过滤器组件
function Filter<T>({ column }: { column: Column<T, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === 'string' ? column.columnDef.header : '';
  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return [];

    // Get all unique values from the column
    const values = [...column.getFacetedUniqueValues().keys()];

    // If the values are arrays, flatten them and get unique items
    // eslint-disable-next-line unicorn/no-array-reduce
    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr];
      }
      return [...acc, curr];
    }, []);

    // Get unique values and sort them
    return [...new Set(flattenedValues)].sort();
  }, [column.getFacetedUniqueValues(), filterVariant]);

  if (filterVariant === 'range') {
    return (
      <div className="*:not-first:mt-2">
        <Label>{columnHeader}</Label>
        <div className="flex">
          <Input
            aria-label={`${columnHeader} min`}
            className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            id={`${id}-range-1`}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
          />
          <Input
            aria-label={`${columnHeader} max`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            id={`${id}-range-2`}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === 'select') {
    return (
      <div className="*:not-first:mt-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === 'all' ? undefined : value);
          }}
          value={columnFilterValue?.toString() ?? 'all'}
        >
          <SelectTrigger id={`${id}-select`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          className="peer ps-9"
          id={`${id}-input`}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="text"
          value={(columnFilterValue ?? '') as string}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
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
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnSizing, setColumnSizing] = useState({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

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
    enableHiding: false,
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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
    getRowId: (row: any, index: number) => String(index),
  });

  // 监听resize事件
  const handleResizeMouseDown = (e: React.MouseEvent, resizeHandler: any) => {
    resizeHandler?.(e);
  };

  return (
    <div className="space-y-6" style={{ position: 'relative' }}>
      {/* 过滤器区域 */}
      {filterableColumns.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filterableColumns.map((columnName) => {
            const column = table.getColumn(columnName as string);
            if (!column) return null;
            return (
              <div className="w-36" key={columnName as string}>
                <Filter column={column} />
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-md border">
        <Table
          className="table-fixed"
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-muted/50" key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  const width = header.getSize?.() || undefined;
                  const isLast = idx === headerGroup.headers.length - 1;
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
                        'relative h-10 select-none border-t',
                        !isLast && 'border-r',
                        'last:[&>.cursor-col-resize]:opacity-0',
                      )}
                      key={header.id}
                      style={{
                        width,
                        minWidth: header.column.columnDef.minSize ?? 40,
                        maxWidth: header.column.columnDef.maxSize ?? 400,
                        position: 'relative',
                      }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer select-none items-center justify-between gap-2',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          <span className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
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
                            <span aria-hidden="true" className="size-4" />
                          )}
                        </div>
                      ) : (
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}
                      {header.column.getCanResize &&
                        header.column.getCanResize() && (
                          <div
                            className="user-select-none before:bg-border absolute -right-2 top-0 z-10 flex h-full w-4 cursor-col-resize touch-none justify-center before:absolute before:inset-y-0 before:w-px before:translate-x-px"
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={(e) =>
                              handleResizeMouseDown(
                                e,
                                header.getResizeHandler(),
                              )
                            }
                            onTouchStart={header.getResizeHandler()}
                          />
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length &&
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="truncate" key={cell.id}>
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
              <TableRow>
                <TableCell
                  className="h-24 text-center"
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
