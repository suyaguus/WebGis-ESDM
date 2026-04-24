/**
 * PAGINATION COMPONENT
 * Reusable pagination controls untuk data tables
 */
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { PaginationMeta } from "@/types/api";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: PaginationProps) {
  const {
    currentPage,
    totalPages,
    pageSize,
    totalRecords,
    hasNextPage,
    hasPrevPage,
  } = pagination;

  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNextPage = () =>
    onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => onPageChange(totalPages);

  const buttonClass = (disabled: boolean) =>
    `p-2 rounded-lg border transition-colors text-slate-600 flex items-center justify-center ${
      disabled
        ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
        : "border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 cursor-pointer hover:text-slate-700"
    }`;

  const selectClass = `px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all ${
    isLoading ? "cursor-not-allowed opacity-50" : ""
  }`;

  return (
    <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-slate-200">
      {/* Top row: Info and Limit Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-[12px] text-slate-600 font-mono">
          <span className="font-semibold text-slate-700">{totalRecords}</span>{" "}
          total data •
          <span className="ml-1">
            Halaman{" "}
            <span className="font-semibold text-slate-700">{currentPage}</span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-700">{totalPages}</span>
          </span>
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="limit"
              className="text-[12px] text-slate-600 font-mono whitespace-nowrap"
            >
              Per Halaman:
            </label>
            <select
              id="limit"
              value={pageSize}
              onChange={(e) => {
                onLimitChange(parseInt(e.target.value));
                onPageChange(1);
              }}
              disabled={isLoading}
              className={selectClass}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Bottom row: Navigation Buttons */}
      <div className="flex items-center justify-center gap-2">
        {/* First page button */}
        <button
          onClick={handleFirstPage}
          disabled={!hasPrevPage || isLoading}
          className={buttonClass(!hasPrevPage || isLoading)}
          title="Halaman pertama"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous page button */}
        <button
          onClick={handlePrevPage}
          disabled={!hasPrevPage || isLoading}
          className={buttonClass(!hasPrevPage || isLoading)}
          title="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page indicator */}
        <div className="px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 text-[12px] font-mono font-semibold min-w-fit">
          Hal {currentPage}
        </div>

        {/* Next page button */}
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage || isLoading}
          className={buttonClass(!hasNextPage || isLoading)}
          title="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last page button */}
        <button
          onClick={handleLastPage}
          disabled={!hasNextPage || isLoading}
          className={buttonClass(!hasNextPage || isLoading)}
          title="Halaman terakhir"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
