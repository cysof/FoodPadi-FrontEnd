// features/dashboard/components/TransporterDashboard.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetTransporterDashboardQuery } from "../data/DashboardApi";
import { clearDashboardErrors } from "../data/DashboardSlice";
import { enqueueSnackbar } from "notistack";
import { StatCardSkeletonGrid, DeliveryCardSkeletonGrid } from "@/components";
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

const DeliveryStatusBadge = ({ status }: { status: string }) => {
  const color =
    status === "PENDING"
      ? "bg-yellow-400"
      : status === "ACCEPTED"
      ? "bg-blue-400"
      : status === "ON_THE_WAY"
      ? "bg-sky-500"
      : status === "DELIVERED"
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <span className={`text-xs text-white px-3 py-1 rounded-full ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const TransporterDashboard = () => {
  const dispatch = useAppDispatch();

  const transporterDashboard = useAppSelector(
    (state) => state.dashboard.transporterDashboard
  );
  const transporterDashboardLoading = useAppSelector(
    (state) => state.dashboard.transporterDashboardLoading
  );
  const transporterDashboardError = useAppSelector(
    (state) => state.dashboard.transporterDashboardError
  );

  useGetTransporterDashboardQuery();

  useEffect(() => {
    if (transporterDashboardError) {
      enqueueSnackbar(transporterDashboardError, { variant: "error" });
      dispatch(clearDashboardErrors());
    }
  }, [transporterDashboardError]);

  if (transporterDashboardLoading) {
    return (
      <div className={`flex flex-col gap-8`}>
        {/* Stats Skeleton */}
        <StatCardSkeletonGrid count={4} />

        {/* Recent Deliveries Skeleton */}
        <div className={`flex flex-col gap-3`}>
          <div className={`h-6 w-48 bg-gray-200 rounded animate-pulse`} />
          <DeliveryCardSkeletonGrid count={3} />
        </div>
      </div>
    );
  }

  const deliveries = transporterDashboard?.results ?? [];
  const totalDeliveries = transporterDashboard?.count ?? 0;
  const pendingDeliveries = deliveries.filter(
    (d) => d.delivery_status === "PENDING"
  ).length;
  const onTheWayDeliveries = deliveries.filter(
    (d) => d.delivery_status === "ON_THE_WAY"
  ).length;
  const completedDeliveries = deliveries.filter(
    (d) => d.delivery_status === "DELIVERED"
  ).length;

  return (
    <div className={`flex flex-col gap-8`}>
      {/* Stats */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4`}>
        <StatCard
          title="Total Deliveries"
          value={totalDeliveries}
          color="text-primary"
        />
        <StatCard
          title="Pending"
          value={pendingDeliveries}
          color="text-yellow-500"
        />
        <StatCard
          title="On The Way"
          value={onTheWayDeliveries}
          color="text-blue-500"
        />
        <StatCard
          title="Completed"
          value={completedDeliveries}
          color="text-green-600"
        />
      </div>

      {/* Recent Deliveries */}
      <div className={`flex flex-col gap-3`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Recent Deliveries
        </h3>
        {deliveries.length === 0 ? (
          <p className={`font-inter text-sm text-gray-500 text-center py-5`}>
            No deliveries assigned yet
          </p>
        ) : (
          <div className={`flex flex-col gap-3`}>
            {deliveries.slice(0, 5).map((delivery) => (
              <div
                key={delivery.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
              >
                <div className={`flex flex-col gap-1`}>
                  <h5
                    className={`font-square font-medium text-primary-black`}
                  >
                    {delivery.crop_name}
                  </h5>
                  <p className={`font-inter text-sm text-gray-500`}>
                    Buyer: {delivery.buyer_name}
                  </p>
                </div>
                <div className={`flex flex-col gap-1`}>
                  <p className={`font-inter text-sm text-primary-black`}>
                    {delivery.delivery_address}
                  </p>
                  <p className={`font-inter text-xs text-gray-400`}>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(delivery.delivery_date))}
                  </p>
                </div>
                <DeliveryStatusBadge status={delivery.delivery_status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransporterDashboard;