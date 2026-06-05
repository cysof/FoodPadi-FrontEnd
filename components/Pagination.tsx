// components/Pagination.tsx (Ultra-defensive version)
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationProps {
  count?: number;  // Make optional with default
  next: string | null;
  previous: string | null;
  currentPage?: number;  // Make optional with default
  onPageChange: (page: number) => void;
  pageSize?: number;
}

const Pagination = ({
  count = 0,
  next,
  previous,
  currentPage = 1,
  onPageChange,
  pageSize = 20,
}: PaginationProps) => {
  // Ensure all values are valid numbers
  const safeCount = Math.max(0, Number(count) || 0);
  const safePageSize = Math.max(1, Number(pageSize) || 20);
  const safeCurrentPage = Math.max(1, Number(currentPage) || 1);
  
  const totalPages = Math.max(1, Math.ceil(safeCount / safePageSize));
  const clampedCurrentPage = Math.min(safeCurrentPage, totalPages);

  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 && safeCount === 0) return null;
  if (totalPages === 1) return null;

  const handlePrevious = () => {
    if (clampedCurrentPage > 1) {
      onPageChange(clampedCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (clampedCurrentPage < totalPages) {
      onPageChange(clampedCurrentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-4 px-2 flex-wrap">
      {/* Page Info */}
      <p className="font-inter text-sm text-gray-500">
        Page{" "}
        <span className="font-medium text-primary-black">
          {clampedCurrentPage}
        </span>{" "}
        of{" "}
        <span className="font-medium text-primary-black">
          {totalPages}
        </span>{" "}
        —{" "}
        <span className="font-medium text-primary-black">
          {safeCount.toLocaleString()}
        </span>{" "}
        total
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={clampedCurrentPage === 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-full border font-inter text-sm font-medium transition-colors duration-200 ${
            clampedCurrentPage > 1
              ? "border-primary text-primary hover:bg-primary hover:text-white"
              : "border-gray-200 text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft width={16} height={16} />
          Previous
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={clampedCurrentPage === totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-full border font-inter text-sm font-medium transition-colors duration-200 ${
            clampedCurrentPage < totalPages
              ? "border-primary text-primary hover:bg-primary hover:text-white"
              : "border-gray-200 text-gray-300 cursor-not-allowed"
          }`}
        >
          Next
          <ChevronRight width={16} height={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;