// features/dashboard/components/FarmerDashboard.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetFarmerDashboardQuery } from "../data/DashboardApi";
import { clearDashboardErrors } from "../data/DashboardSlice";
import { enqueueSnackbar } from "notistack";
import { StatCardSkeletonGrid, TableSkeleton } from "@/components";
import { Status } from "@/features/order/types/order.types";
import { useEffect } from "react";

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <div
    className={`flex flex-col gap-2 px-5 py-6 rounded-2xl border border-gray-200 bg-white shadow-sm`}
  >
    <p className={`font-inter text-sm text-gray-500`}>{title}</p>
    <h3 className={`font-square font-bold text-2xl ${color}`}>{value}</h3>
  </div>
);

const FarmerDashboard = () => {
  const dispatch = useAppDispatch();

  const farmerDashboard = useAppSelector(
    (state) => state.dashboard.farmerDashboard
  );
  const farmerDashboardLoading = useAppSelector(
    (state) => state.dashboard.farmerDashboardLoading
  );
  const farmerDashboardError = useAppSelector(
    (state) => state.dashboard.farmerDashboardError
  );

  useGetFarmerDashboardQuery();

  useEffect(() => {
    if (farmerDashboardError) {
      enqueueSnackbar(farmerDashboardError, { variant: "error" });
      dispatch(clearDashboardErrors());
    }
  }, [farmerDashboardError]);

  if (farmerDashboardLoading) {
    return (
      <div className={`flex flex-col gap-8`}>
        {/* Stats Skeleton */}
        <StatCardSkeletonGrid count={4} />

        {/* Status Breakdown Skeleton */}
        <div className={`flex flex-col gap-3`}>
          <div className={`h-6 w-48 bg-gray-200 rounded animate-pulse`} />
          <StatCardSkeletonGrid count={5} />
        </div>

        {/* Recent Orders Skeleton */}
        <div className={`flex flex-col gap-3`}>
          <div className={`h-6 w-48 bg-gray-200 rounded animate-pulse`} />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-8`}>
      {/* Stats */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4`}>
        <StatCard
          title="Total Crops Listed"
          value={farmerDashboard?.total_crops ?? 0}
          color="text-primary"
        />
        <StatCard
          title="Total Orders"
          value={farmerDashboard?.total_orders ?? 0}
          color="text-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(Number(farmerDashboard?.total_revenue ?? 0))}
          color="text-green-600"
        />
        <StatCard
          title="Pending Revenue"
          value={new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(Number(farmerDashboard?.pending_revenue ?? 0))}
          color="text-yellow-500"
        />
      </div>

      {/* Status Breakdown */}
      <div className={`flex flex-col gap-3`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Order Status Breakdown
        </h3>
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3`}
        >
          {[
            { label: "Pending", key: "PENDING", color: "bg-yellow-400" },
            { label: "Confirmed", key: "CONFIRMED", color: "bg-blue-500" },
            { label: "Shipped", key: "SHIPPED", color: "bg-sky-500" },
            { label: "Delivered", key: "DELIVERED", color: "bg-green-500" },
            { label: "Cancelled", key: "CANCELLED", color: "bg-red-500" },
          ].map((item) => (
            <div
              key={item.key}
              className={`flex flex-col gap-2 px-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
            >
              <span
                className={`text-xs text-white w-max px-3 py-1 rounded-full ${item.color}`}
              >
                {item.label}
              </span>
              <h3
                className={`font-square font-bold text-2xl text-primary-black`}
              >
                {farmerDashboard?.status_breakdown[
                  item.key as keyof typeof farmerDashboard.status_breakdown
                ] ?? 0}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`flex flex-col gap-3`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Recent Orders
        </h3>
        {farmerDashboard?.recent_orders.length === 0 ? (
          <p className={`font-inter text-sm text-gray-500 text-center py-5`}>
            No orders yet
          </p>
        ) : (
          <div className={`flex flex-col gap-3`}>
            {farmerDashboard?.recent_orders.map((order) => (
              <div
                key={order.order_id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
              >
                <div className={`flex flex-col gap-1`}>
                  <h5
                    className={`font-square font-medium text-primary-black`}
                  >
                    {order.crop_name}
                  </h5>
                  <p className={`font-inter text-sm text-gray-500`}>
                    Buyer: {order.buyer_name}
                  </p>
                </div>
                <div className={`flex flex-col gap-1`}>
                  <p className={`font-inter text-sm text-primary-black`}>
                    Qty: {order.quantity}
                  </p>
                  <p className={`font-inter text-sm text-primary-black`}>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(Number(order.total_price))}
                  </p>
                </div>
                <div
                  className={`flex flex-col gap-1 items-start sm:items-end`}
                >
                  <span
                    className={`text-xs text-white px-3 py-1 rounded-full ${
                      order.status === Status.PENDING
                        ? `bg-yellow-400`
                        : order.status === Status.CONFIRMED
                        ? `bg-blue-500`
                        : order.status === Status.SHIPPED
                        ? `bg-sky-500`
                        : order.status === Status.DELIVERED
                        ? `bg-green-500`
                        : `bg-red-500`
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className={`font-inter text-xs text-gray-400`}>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(order.ordered_at))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;