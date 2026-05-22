// features/order/components/BuyerOrderTable.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useDebounce } from "primereact/hooks";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useRef } from "react";
import {
  clearBuyerOrderErrors,
  setBuyerOrderStatusFilter,
} from "../data/BuyerOrderSlice";
import { enqueueSnackbar } from "notistack";
import { useGetAllBuyerOrdersQuery, useCancelBuyerOrderMutation } from "../data/BuyerOrderApi";
import { Status } from "../types/order.types";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";
import Link from "next/link";
import { Eye } from "lucide-react";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const BuyerOrderTable = () => {
  const dispatch = useAppDispatch();
  const cancelReasonRef = useRef<string>("");

  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);

  useEffect(() => {
    dispatch(setBuyerOrderStatusFilter(debouncedValue));
  }, [debouncedValue]);

  const buyerOrders = useAppSelector((state) => state.buyerOrders.buyerOrders);
  const getAllBuyerOrdersError = useAppSelector(
    (state) => state.buyerOrders.getAllBuyerOrdersError
  );
  const getAllBuyerOrdersLoading = useAppSelector(
    (state) => state.buyerOrders.getAllBuyerOrdersLoading
  );
  const cancelBuyerOrderError = useAppSelector(
    (state) => state.buyerOrders.cancelBuyerOrderError
  );
  const statusFilter = useAppSelector(
    (state) => state.buyerOrders.statusFilter
  );

  const query = {
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  useGetAllBuyerOrdersQuery(query);

  const [CancelBuyerOrderMutation] = useCancelBuyerOrderMutation();

  useEffect(() => {
    if (getAllBuyerOrdersError) {
      enqueueSnackbar(getAllBuyerOrdersError, { variant: "error" });
      dispatch(clearBuyerOrderErrors());
    }
  }, [getAllBuyerOrdersError]);

  useEffect(() => {
    if (cancelBuyerOrderError) {
      enqueueSnackbar(cancelBuyerOrderError, { variant: "error" });
      dispatch(clearBuyerOrderErrors());
    }
  }, [cancelBuyerOrderError]);

  const handleCancelOrder = (order: IOrderData) => {
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
        CancelBuyerOrderMutation({
          id: Number(order.id),
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

  const DateTemplate = (value: IOrderData) => (
    <div className={`text-black font-inter text-sm w-full`}>
      {new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value.ordered_at))}
    </div>
  );

  const PriceTemplate = (value: IOrderData) => (
    <div className={`text-black font-inter text-sm w-full`}>
      {new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(Number(value.total_price))}
    </div>
  );

  const StatusTemplate = (value: IOrderData) =>
    value.status === Status.PENDING ? (
      <span className="text-xs text-white px-3 py-1 rounded-full bg-yellow-400">
        PENDING
      </span>
    ) : value.status === Status.CONFIRMED ? (
      <span className="text-xs text-white px-3 py-1 rounded-full bg-blue-500">
        CONFIRMED
      </span>
    ) : value.status === Status.SHIPPED ? (
      <span className="text-xs text-white px-3 py-1 rounded-full bg-sky-500">
        SHIPPED
      </span>
    ) : value.status === Status.DELIVERED ? (
      <span className="text-xs text-white px-3 py-1 rounded-full bg-green-500">
        DELIVERED
      </span>
    ) : (
      value.status === Status.CANCELLED && (
        <span className="text-xs text-white px-3 py-1 rounded-full bg-red-500">
          CANCELLED
        </span>
      )
    );

  const ActionTemplate = (value: IOrderData) => (
    <div className={`flex items-center gap-2`}>
      <Link
        href={`/dashboard/orders/${value.id}`}
        className={`text-primary hover:text-primary/80 transition-colors duration-200`}
      >
        <Eye width={18} height={18} />
      </Link>
      {value.status === Status.PENDING && (
        <button
          onClick={() => handleCancelOrder(value)}
          className={`text-xs text-red-500 border border-red-500 px-2 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200`}
        >
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className={`flex flex-col gap-5`}>
      <ConfirmDialog className={`mx-2`} />
      <div className={`flex flex-col sm:flex-row gap-3`}>
        <InputText
          placeholder="Search for an order"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`sm:max-w-md w-full`}
          type="search"
        />
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => dispatch(setBuyerOrderStatusFilter(e.value))}
          placeholder="Filter by status"
          className={`w-full sm:max-w-[200px]`}
        />
      </div>
      <div className={`w-full shrink`}>
        <DataTable
          loading={getAllBuyerOrdersLoading}
          value={buyerOrders}
          breakpoint="1300px"
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage={
            <p className={`text-center font-inter text-lg text-black`}>
              You don&apos;t have any order yet
            </p>
          }
          className={`bg-white`}
        >
          <Column
            header="Crop Name"
            field="crop_name"
            style={{ width: "20%" }}
            className={`capitalize`}
          />
          <Column
            header="Quantity"
            field="quantity"
            style={{ width: "10%" }}
          />
          <Column
            header="Total Price"
            body={PriceTemplate}
            field="total_price"
            style={{ width: "15%" }}
          />
          <Column
            header="Status"
            body={StatusTemplate}
            field="status"
            style={{ width: "15%" }}
          />
          <Column
            header="Order Date"
            body={DateTemplate}
            field="ordered_at"
            style={{ width: "20%" }}
          />
          <Column
            header="Action"
            body={ActionTemplate}
            style={{ width: "20%" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default BuyerOrderTable;