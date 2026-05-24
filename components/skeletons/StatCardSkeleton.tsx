// components/skeletons/StatCardSkeleton.tsx
import { Skeleton } from "primereact/skeleton";
import React from "react";

const StatCardSkeleton = () => {
  return (
    <div
      className={`flex flex-col gap-2 px-5 py-6 rounded-2xl border border-gray-200 bg-white shadow-sm`}
    >
      <Skeleton width="60%" height="12px" />
      <Skeleton width="80%" height="24px" />
    </div>
  );
};

export const StatCardSkeletonGrid = ({ count = 4 }: { count?: number }) => {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4`}>
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default StatCardSkeleton;