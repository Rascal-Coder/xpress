type UsePaginationProps = {
  currentPage: number;
  paginationItemsToDisplay: number;
  totalPages: number;
};

type UsePaginationReturn = {
  lastPageNumbers: number[];
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
};

export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay,
}: UsePaginationProps): UsePaginationReturn {
  const showLeftEllipsis = currentPage > 3;
  const showRightEllipsis = totalPages - currentPage > 2 && totalPages > 5;
  const lastPageNumbers: number[] = [];

  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];

    // 添加当前页及其前后的页码
    if (currentPage <= 3) {
      // 在靠近开始的位置
      for (let i = 1; i <= Math.min(4, totalPages); i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // 在靠近结束的位置
      for (let i = Math.max(1, totalPages - 3); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 在中间位置
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
    }

    // 如果需要显示末尾页码，并且不是已经在接近末尾
    if (showRightEllipsis && currentPage < totalPages - 2) {
      // 添加最后一页到lastPageNumbers
      lastPageNumbers.push(totalPages);
    }

    return pages;
  }

  const pages = calculatePaginationRange();

  return {
    pages,
    showLeftEllipsis,
    lastPageNumbers,
    showRightEllipsis,
  };
}
