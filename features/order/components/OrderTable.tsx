"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useDebounce } from "primereact/hooks";
import { InputText } from "primereact/inputtext";
import React from "react";
import { clearOrdersError, setSearchTerm } from "../data/OrderSlice";
import { enqueueSnackbar } from "notistack";
import { useGetAllOrdersQuery } from "../data/OrderApi";
import { Status } from "../types/order.types";
import OrderOverlayButton from "./OrderOverlayButton";

const OrderTable = () => {
  const dispatch = useAppDispatch();

  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);

  dispatch(setSearchTerm(debouncedValue));

  const orders = useAppSelector((state) => state.orders.orders);
  const getAllOrdersError = useAppSelector(
    (state) => state.orders.getAllOrdersError
  );
  const getAllOrdersLoading = useAppSelector(
    (state) => state.orders.getAllOrdersLoading
  );
  const search = useAppSelector((state) => state.orders.search);

  const query = {
    ...(search ? { search } : {}),
  };

  useGetAllOrdersQuery(query);

  if (getAllOrdersError) {
    enqueueSnackbar(getAllOrdersError, { variant: "error" });
    dispatch(clearOrdersError());
  }

  const NoteTemplate = (value: IOrderData) => (
    <div
      className={`text-black font-inter text-sm truncate max-w-[300px] w-full line-clamp-1`}
    >
      {value.notes}
    </div>
  );

  const DateTemplate = (value: IOrderData) => (
    <div className={`text-black font-inter text-sm w-full`}>
      {new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value.ordered_at))}
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

  return (
    <div className={`flex flex-col gap-5`}>
      <InputText
        placeholder="Search for an order"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`sm:max-w-md w-full`}
        type="search"
      />
      <div className={`w-full shrink`}>
        <DataTable
          loading={getAllOrdersLoading}
          value={orders}
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
            header={`Buyer`}
            // body={ImgTemplate}
            field="buyer_name"
            style={{ width: "25%" }}
          ></Column>
          <Column
            className={`capitalize`}
            field="crop_name"
            header="Crop Name"
            style={{ width: "20%" }}
          ></Column>
          <Column
            style={{ width: "5%" }}
            // body={DescriptionTemplate}
            field="quantity"
            header="Quantity"
          ></Column>
          <Column
            style={{ width: "10%" }}
            body={StatusTemplate}
            field="status"
            header="Status"
          ></Column>
          <Column
            style={{ width: "15%" }}
            body={DateTemplate}
            field="ordered_at"
            header="Order Date"
          ></Column>
          <Column
            style={{ width: "25%" }}
            field="notes"
            body={NoteTemplate}
            header="Special Note"
          ></Column>
          {/* <Column
            style={{ width: "10%" }}
            body={DateTemplate}
            field="harvested_date"
            header="Date Harvested"
          ></Column> */}
          <Column
            style={{ width: "10%" }}
            header="Action"
            body={(e: IOrderData) => <OrderOverlayButton value={e} />}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default OrderTable;
