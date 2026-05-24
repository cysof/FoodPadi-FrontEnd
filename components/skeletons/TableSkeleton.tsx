// components/skeletons/TableSkeleton.tsx
import { Skeleton } from "primereact/skeleton";
import React from "react";

const TableRowSkeleton = () => {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100`}
    >
      <Skeleton width="20%" height="12px" />
      <Skeleton width="15%" height="12px" />
      <Skeleton width="20%" height="12px" />
      <Skeleton width="10%" height="20px" borderRadius="20px" />
      <Skeleton width="15%" height="12px" />
      <Skeleton width="10%" height="12px" />
    </div>
  );
};

const TableSkeleton = ({ rows = 8 }: { rows?: number }) => {
  return (
    <div
      className={`flex flex-col w-full rounded-2xl border border-gray-200 overflow-hidden`}
    >
      {/* Table Header */}
      <div
        className={`flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200`}
      >
        <Skeleton width="20%" height="12px" />
        <Skeleton width="15%" height="12px" />
        <Skeleton width="20%" height="12px" />
        <Skeleton width="10%" height="12px" />
        <Skeleton width="15%" height="12px" />
        <Skeleton width="10%" height="12px" />
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} />
      ))}
    </div>
  );
};

export default TableSkeleton;