// features/orderById/components/OrderPage.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";
import { enqueueSnackbar } from "notistack";
import React, { useRef } from "react";
import { useAcceptOrderMutation, useCancelOrderMutation } from "../data/OrderIDApi";
import { clearOrderByIdError } from "../data/OrderIDSlice";

const OrderPage = () => {
  const dispatch = useAppDispatch();
  const cancelReasonRef = useRef<string>("");

  const order = useAppSelector((state) => state.orderById.order);
  const acceptOrderError = useAppSelector((state) => state.orderById.acceptOrderError);
  const cancelOrderError = useAppSelector((state) => state.orderById.cancelOrderError);
  const acceptOrderLoading = useAppSelector((state) => state.orderById.acceptOrderLoading);
  const cancelOrderLoading = useAppSelector((state) => state.orderById.cancelOrderLoading);

  const [AcceptOrderMutation] = useAcceptOrderMutation();
  const [CancelOrderMutation] = useCancelOrderMutation();

  if (acceptOrderError) {
    enqueueSnackbar(acceptOrderError, { variant: "error" });
    dispatch(clearOrderByIdError());
  }

  if (cancelOrderError) {
    enqueueSnackbar(cancelOrderError, { variant: "error" });
    dispatch(clearOrderByIdError());
  }

  const handleAcceptOrder = () => {
    confirmDialog({
      message: `Are you sure you want to accept the order for ${order?.crop_name}?`,
      header: "Accept Order",
      icon: "pi pi-check-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept: () =>
        AcceptOrderMutation({ id: Number(order?.id) })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Order accepted successfully!", {
              variant: "success",
            })
          )
          .catch(() => {}),
    });
  };

  const handleCancelOrder = () => {
    cancelReasonRef.current = "";
    confirmDialog({
      message: (
        <div className={`flex flex-col gap-3`}>
          <p className={`font-inter text-sm text-gray-600`}>
            Please provide a reason for cancelling this order.
          </p>
          <InputTextarea
            autoFocus
            className={`resize-none w-full`}
            rows={3}
            placeholder="Enter cancellation reason..."
            onChange={(e) => {
              cancelReasonRef.current = e.target.value;
            }}
          />
        </div>
      ),
      header: "Cancel Order",
      icon: "pi pi-times-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, Cancel Order",
      rejectLabel: "Go Back",
      accept: () => {
        if (!cancelReasonRef.current.trim()) {
          enqueueSnackbar("Please provide a cancellation reason.", {
            variant: "warning",
          });
          return;
        }
        CancelOrderMutation({
          id: Number(order?.id),
          reason: cancelReasonRef.current,
        })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Order cancelled successfully.", {
              variant: "success",
            })
          )
          .catch(() => {});
      },
    });
  };

  const isPending = order?.status === Status.PENDING;

  return (
    <div className={`flex flex-col gap-8`}>
      <ConfirmDialog />
      <h3 className={`font-square font-bold text-3xl text-primary-black`}>
        Order #{order?.id}
      </h3>
      <div className={`flex flex-col gap-1`}>
        <h5 className={`font-square font-medium text-lg text-primary`}>
          Buyer
        </h5>
        <p className={`font-inter font-normal text-sm text-primary-black`}>
          {order?.buyer_name}
        </p>
      </div>
      <div className={`flex flex-col gap-2`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Order Summary
        </h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3`}>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Crop
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.crop_name}
            </p>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Quantity
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.quantity}
            </p>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Total Price
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(Number(order?.total_price))}
            </p>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Status
            </h5>
            <span
              className={`w-max text-xs text-white px-3 py-1 rounded-full ${
                order?.status === Status.PENDING
                  ? `bg-yellow-400`
                  : order?.status === Status.CONFIRMED
                  ? `bg-blue-500`
                  : order?.status === Status.SHIPPED
                  ? `bg-sky-500`
                  : order?.status === Status.DELIVERED
                  ? `bg-green-500`
                  : `bg-red-500`
              }`}
            >
              {order?.status}
            </span>
          </div>
        </div>
      </div>
      <div className={`flex flex-col gap-2`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Delivery Information
        </h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3`}>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Delivery Address
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.delivery_address}
            </p>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Special Note
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.notes ? order?.notes : `N/A`}
            </p>
          </div>
        </div>
      </div>

      {/* Show cancel reason if order is cancelled */}
      {order?.status === Status.CANCELLED && order?.cancel_reason && (
        <div className={`flex flex-col gap-1`}>
          <h5 className={`font-square font-medium text-lg text-red-600`}>
            Cancellation Reason
          </h5>
          <p className={`font-inter font-normal text-sm text-red-500`}>
            {order?.cancel_reason}
          </p>
        </div>
      )}

      {/* Only show action buttons if order is PENDING */}
      {isPending && (
        <div
          className={`flex flex-col-reverse sm:flex-row justify-center sm:items-center gap-4 mt-5`}
        >
          <Button
            outlined
            className={`danger justify-center`}
            label="Cancel Order"
            loading={cancelOrderLoading}
            onClick={handleCancelOrder}
          />
          <Button
            className={`primary justify-center`}
            label="Accept Order"
            loading={acceptOrderLoading}
            onClick={handleAcceptOrder}
          />
        </div>
      )}
    </div>
  );
};

export default OrderPage;