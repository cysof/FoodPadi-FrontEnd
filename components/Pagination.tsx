// components/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationProps {
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

const Pagination = ({
  count,
  next,
  previous,
  currentPage,
  onPageChange,
  pageSize = 20,
}: PaginationProps) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-between gap-3 py-4 px-2`}
    >
      {/* Page Info */}
      <p className={`font-inter text-sm text-gray-500`}>
        Page{" "}
        <span className={`font-medium text-primary-black`}>
          {currentPage}
        </span>{" "}
        of{" "}
        <span className={`font-medium text-primary-black`}>
          {totalPages}
        </span>{" "}
        —{" "}
        <span className={`font-medium text-primary-black`}>
          {count}
        </span>{" "}
        total
      </p>

      {/* Buttons */}
      <div className={`flex items-center gap-2`}>
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!previous}
          className={`flex items-center gap-1 px-4 py-2 rounded-full border font-inter text-sm font-medium transition-colors duration-200 ${
            previous
              ? `border-primary text-primary hover:bg-primary hover:text-white`
              : `border-gray-200 text-gray-300 cursor-not-allowed`
          }`}
        >
          <ChevronLeft width={16} height={16} />
          Previous
        </button>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!next}
          className={`flex items-center gap-1 px-4 py-2 rounded-full border font-inter text-sm font-medium transition-colors duration-200 ${
            next
              ? `border-primary text-primary hover:bg-primary hover:text-white`
              : `border-gray-200 text-gray-300 cursor-not-allowed`
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