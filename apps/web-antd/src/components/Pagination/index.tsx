import { ChevronLeft, ChevronRight } from '@xpress/icons';
import { cn } from '@xpress/utils';
import {
  buttonVariants,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@xpress-core/shadcn-ui';

import React from 'react';

import { usePagination } from './usePagination';

type PaginationProps = {
  currentPage: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (value: number) => void;
  paginationItemsToDisplay?: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  total?: number;
  totalPages: number;
};

export default function Component({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  rowsPerPage = 40,
  onRowsPerPageChange,
  onPageChange,
  rowsPerPageOptions = [10, 20, 30, 40, 50, 100],
  total,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis, lastPageNumbers } =
    usePagination({
      currentPage,
      totalPages,
      paginationItemsToDisplay,
    });

  const handleRowsPerPageChange = React.useCallback(
    (value: string) => {
      onRowsPerPageChange?.(Number(value));
    },
    [onRowsPerPageChange],
  );

  const handlePageChange = React.useCallback(
    (page: number, event?: React.MouseEvent) => {
      if (event) {
        event.preventDefault();
      }

      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange?.(page);
      }
    },
    [currentPage, onPageChange, totalPages],
  );

  const totalItems = total ?? totalPages * rowsPerPage;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground text-sm">
          共<span className="text-foreground">{totalItems}</span>条
        </div>
        <Select
          defaultValue={String(rowsPerPage)}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={String(rowsPerPage)} />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}条/页
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Pagination>
          <PaginationContent className="shadow-xs inline-flex gap-0 -space-x-px rounded-md rtl:space-x-reverse">
            {/* Previous page button */}
            <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
              <PaginationLink
                aria-disabled={currentPage === 1 ? true : undefined}
                aria-label="Go to previous page"
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                  }),
                  'rounded-none shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50',
                )}
                href={`#/page/${currentPage - 1}`}
                onClick={(e) => handlePageChange(currentPage - 1, e)}
                role={currentPage === 1 ? 'link' : undefined}
              >
                <ChevronLeft aria-hidden="true" size={16} />
              </PaginationLink>
            </PaginationItem>

            {/* 首页 - 永远显示第一页 */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationLink
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                    }),
                    'rounded-none shadow-none focus-visible:z-10',
                  )}
                  href={`#/page/1`}
                  onClick={(e) => handlePageChange(1, e)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Left ellipsis (...) */}
            {showLeftEllipsis && (
              <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
                <PaginationEllipsis
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                    }),
                    'pointer-events-none rounded-none shadow-none',
                  )}
                />
              </PaginationItem>
            )}

            {/* Page number links */}
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                    }),
                    'rounded-none shadow-none focus-visible:z-10',
                    page === currentPage && 'bg-accent',
                  )}
                  href={`#/page/${page}`}
                  isActive={page === currentPage}
                  onClick={(e) => handlePageChange(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Right ellipsis (...) */}
            {showRightEllipsis && (
              <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
                <PaginationEllipsis
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                    }),
                    'pointer-events-none rounded-none shadow-none',
                  )}
                />
              </PaginationItem>
            )}

            {/* 显示末尾页码 */}
            {lastPageNumbers.map((page) => (
              <PaginationItem key={`last-${page}`}>
                <PaginationLink
                  className={cn(
                    buttonVariants({
                      variant: 'outline',
                    }),
                    'rounded-none shadow-none focus-visible:z-10',
                  )}
                  href={`#/page/${page}`}
                  onClick={(e) => handlePageChange(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next page button */}
            <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
              <PaginationLink
                aria-disabled={currentPage === totalPages ? true : undefined}
                aria-label="Go to next page"
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                  }),
                  'rounded-none shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50',
                )}
                href={`#/page/${currentPage + 1}`}
                onClick={(e) => handlePageChange(currentPage + 1, e)}
                role={currentPage === totalPages ? 'link' : undefined}
              >
                <ChevronRight aria-hidden="true" size={16} />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
