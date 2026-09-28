"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemName?: string;
  className?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemName = "results",
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex =
    totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate smart page numbers with ellipsis
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }

    if (safeCurrentPage >= totalPages - 3) {
      return [
        1,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 bg-white border border-stone-200 rounded-2xl shadow-2xs text-xs font-inter text-stone-600 ${className}`}
    >
      {/* Items Summary & Page Size Selector */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-stone-500 font-medium">
          Showing{" "}
          <span className="font-semibold text-stone-900">{startIndex}</span> to{" "}
          <span className="font-semibold text-stone-900">{endIndex}</span> of{" "}
          <span className="font-semibold text-stone-900">{totalItems}</span>{" "}
          {itemName}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-stone-200">
            <span className="text-stone-400 text-[11px] hidden md:inline">
              Rows:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="py-1 px-2 text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-medium cursor-pointer focus:outline-none focus:border-[#7E5714]"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5 self-center sm:self-auto">
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
            safeCurrentPage <= 1
              ? "border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50/50"
              : "border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 cursor-pointer shadow-2xs"
          }`}
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-stone-400 font-mono tracking-widest text-[11px]"
                >
                  ...
                </span>
              );
            }

            const isActive = page === safeCurrentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[32px] h-8 px-2.5 rounded-lg font-medium text-xs transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "bg-[#1C1B1B] text-[#D4AF37] font-bold shadow-xs border border-[#1C1B1B]"
                    : "border border-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
            safeCurrentPage >= totalPages
              ? "border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50/50"
              : "border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 cursor-pointer shadow-2xs"
          }`}
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
