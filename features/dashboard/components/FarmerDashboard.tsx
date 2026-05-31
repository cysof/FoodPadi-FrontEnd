// features/dashboard/components/FarmerDashboard.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetFarmerDashboardQuery } from "../data/DashboardApi";
import { clearDashboardErrors } from "../data/DashboardSlice";
import { enqueueSnackbar } from "notistack";
import { StatCardSkeletonGrid, TableSkeleton } from "@/components";
import { Status } from "@/features/order/types/order.types";
import { useEffect, useState } from "react";
import { useAcceptOrderMutation, useCancelOrderMutation } from "@/features/orderById/data/OrderIDApi";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";

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
  const [cancelReason, setCancelReason] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const farmerDashboard = useAppSelector(
    (state) => state.dashboard.farmerDashboard
  );
  const farmerDashboardLoading = useAppSelector(
    (state) => state.dashboard.farmerDashboardLoading
  );
  const farmerDashboardError = useAppSelector(
    (state) => state.dashboard.farmerDashboardError
  );

  const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const { refetch } = useGetFarmerDashboardQuery();

  useEffect(() => {
    if (farmerDashboardError) {
      enqueueSnackbar(farmerDashboardError, { variant: "error" });
      dispatch(clearDashboardErrors());
    }
  }, [farmerDashboardError]);

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await acceptOrder({ id: orderId }).unwrap();
      enqueueSnackbar("Order accepted successfully!", { variant: "success" });
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || "Failed to accept order", { variant: "error" });
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    if (!cancelReason.trim()) {
      enqueueSnackbar("Please provide a cancellation reason", { variant: "error" });
      return;
    }

    try {
      await cancelOrder({ id: selectedOrderId, reason: cancelReason }).unwrap();
      enqueueSnackbar("Order cancelled successfully!", { variant: "success" });
      setShowCancelDialog(false);
      setCancelReason("");
      setSelectedOrderId(null);
      refetch();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.detail || "Failed to cancel order", { variant: "error" });
    }
  };

  const openCancelDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowCancelDialog(true);
  };

  if (farmerDashboardLoading) {
    return (
      <div className={`flex flex-col gap-8`}>
        <StatCardSkeletonGrid count={4} />
        <div className={`flex flex-col gap-3`}>
          <div className={`h-6 w-48 bg-gray-200 rounded animate-pulse`} />
          <StatCardSkeletonGrid count={5} />
        </div>
        <div className={`flex flex-col gap-3`}>
          <div className={`h-6 w-48 bg-gray-200 rounded animate-pulse`} />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-8`}>
      <ConfirmDialog
        visible={showCancelDialog}
        onHide={() => {
          setShowCancelDialog(false);
          setCancelReason("");
          setSelectedOrderId(null);
        }}
        header="Cancel Order"
        message={
          <div className="flex flex-col gap-3">
            <p>Please provide a reason for cancelling this order:</p>
            <InputTextarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              rows={3}
              autoFocus
            />
          </div>
        }
        icon="pi pi-exclamation-triangle"
        acceptLabel="Yes, Cancel Order"
        rejectLabel="No, Go Back"
        acceptClassName="p-button-danger"
        accept={handleCancelOrder}
      />

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
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3`}>
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
              <h3 className={`font-square font-bold text-2xl text-primary-black`}>
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
                className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
              >
                <div className={`flex flex-col gap-1 flex-1`}>
                  <h5 className={`font-square font-medium text-primary-black`}>
                    {order.crop_name}
                  </h5>
                  <p className={`font-inter text-sm text-gray-500`}>
                    Buyer: {order.buyer_name}
                  </p>
                  <p className={`font-inter text-sm text-gray-500`}>
                    Order ID: #{order.order_id}
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
                
                <div className={`flex flex-col gap-1 items-start lg:items-end`}>
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

                {/* Action Buttons - Only show for PENDING orders */}
                {order.status === Status.PENDING && (
                  <div className={`flex gap-2 mt-3 lg:mt-0`}>
                    <Button
                      label="Accept"
                      icon="pi pi-check"
                      className="p-button-success p-button-sm"
                      onClick={() => handleAcceptOrder(order.order_id)}
                      loading={isAccepting}
                      disabled={isAccepting || isCancelling}
                    />
                    <Button
                      label="Cancel"
                      icon="pi pi-times"
                      className="p-button-danger p-button-sm"
                      onClick={() => openCancelDialog(order.order_id)}
                      loading={isCancelling && selectedOrderId === order.order_id}
                      disabled={isAccepting || isCancelling}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;