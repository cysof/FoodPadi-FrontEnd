// components/skeletons/DeliveryCardSkeleton.tsx
import { Skeleton } from "primereact/skeleton";
import React from "react";

const DeliveryCardSkeleton = () => {
  return (
    <div
      className={`flex flex-col gap-3 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between`}>
        <Skeleton width="40%" height="20px" />
        <Skeleton width="25%" height="20px" borderRadius="20px" />
      </div>

      {/* Buyer */}
      <div className={`flex items-center gap-2`}>
        <Skeleton shape="circle" width="16px" height="16px" />
        <Skeleton width="60%" height="12px" />
      </div>

      {/* Address */}
      <div className={`flex items-center gap-2`}>
        <Skeleton shape="circle" width="16px" height="16px" />
        <Skeleton width="80%" height="12px" />
      </div>

      {/* Date */}
      <div className={`flex items-center gap-2`}>
        <Skeleton shape="circle" width="16px" height="16px" />
        <Skeleton width="50%" height="12px" />
      </div>
    </div>
  );
};

export const DeliveryCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <DeliveryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default DeliveryCardSkeleton;