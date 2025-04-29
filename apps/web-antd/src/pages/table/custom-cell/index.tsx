/* eslint-disable unicorn/no-nested-ternary */
import { ChevronDownIcon, ChevronUpIcon } from '@xpress/icons';
import { cn } from '@xpress/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@xpress-core/shadcn-ui';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

type Item = {
  balance: number;
  department: string;
  email: string;
  flag: string;
  id: string;
  joinDate: string;
  lastActive: string;
  location: string;
  name: string;
  performance: 'Average' | 'Excellent' | 'Good' | 'Poor';
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
};

const columns: ColumnDef<Item>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.getValue('name')}</div>
    ),
    sortUndefined: 'last',
    sortDescFirst: false,
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Location',
    accessorKey: 'location',
    cell: ({ row }) => (
      <div className="truncate">
        <span className="text-lg leading-none">{row.original.flag}</span>{' '}
        {row.getValue('location')}
      </div>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Balance',
    accessorKey: 'balance',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('balance'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return formatted;
    },
  },
  {
    header: 'Department',
    accessorKey: 'department',
  },
  // {
  //   header: 'Role',
  //   accessorKey: 'role',
  // },
  // {
  //   header: 'Join Date',
  //   accessorKey: 'joinDate',
  // },
  // {
  //   header: 'Last Active',
  //   accessorKey: 'lastActive',
  // },
  // {
  //   header: 'Performance',
  //   accessorKey: 'performance',
  // },
];

export default function Component() {
  const [data, setData] = useState<Item[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        'https://res.cloudinary.com/dlzlfasou/raw/upload/users-01_fertyx.json',
      );
      const data = await res.json();
      setData(data.slice(0, 5)); // Limit to 5 items
    }
    fetchPosts();
  }, []);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSortingRemoval: false,
  });

  return (
    <div className="w-full bg-white p-4">
      <div className="overflow-hidden rounded-md border">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-muted/50" key={headerGroup.id}>
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
                      className="relative h-10 select-none border-r"
                      key={header.id}
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      <div className="relative h-full w-full">
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                'flex h-full cursor-pointer select-none items-center justify-between gap-2',
                              'pr-2',
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
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className:
                              'absolute top-0 right-0 h-full w-1 cursor-col-resize user-select-none touch-none z-10 hover:bg-primary hover:w-1.5 transition-all',
                            style: {
                              backgroundColor: 'var(--border)',
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Resizable and sortable columns made with{' '}
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
