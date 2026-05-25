// features/order/components/OrderTable.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useDebounce } from "primereact/hooks";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { clearOrdersError, setSearchTerm } from "../data/OrderSlice";
import { enqueueSnackbar } from "notistack";
import { useGetAllOrdersQuery } from "../data/OrderApi";
import { Status } from "../types/order.types";
import OrderOverlayButton from "./OrderOverlayButton";
import { Pagination, EmptyState } from "@/components";
import { Package } from "lucide-react";

const OrderTable = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);

  useEffect(() => {
    dispatch(setSearchTerm(debouncedValue));
    setCurrentPage(1);
  }, [debouncedValue]);

  const orders = useAppSelector((state) => state.orders.orders);
  const getAllOrdersError = useAppSelector(
    (state) => state.orders.getAllOrdersError
  );
  const getAllOrdersLoading = useAppSelector(
    (state) => state.orders.getAllOrdersLoading
  );
  const search = useAppSelector((state) => state.orders.search);
  const count = useAppSelector((state) => state.orders.count);
  const next = useAppSelector((state) => state.orders.next);
  const previous = useAppSelector((state) => state.orders.previous);

  const query = {
    ...(search ? { search } : {}),
    page: currentPage,
  };

  useGetAllOrdersQuery(query);

  useEffect(() => {
    if (getAllOrdersError) {
      enqueueSnackbar(getAllOrdersError, { variant: "error" });
      dispatch(clearOrdersError());
    }
  }, [getAllOrdersError]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      {!getAllOrdersLoading && orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Yet"
          message="You have not received any orders yet. Share your crop listings to start receiving orders from buyers."
        />
      ) : (
        <div className={`w-full shrink`}>
          <DataTable
            loading={getAllOrdersLoading}
            value={orders}
            breakpoint="1300px"
            tableStyle={{ minWidth: "50rem" }}
            className={`bg-white`}
          >
            <Column
              header={`Buyer`}
              field="buyer_name"
              style={{ width: "25%" }}
            />
            <Column
              className={`capitalize`}
              field="crop_name"
              header="Crop Name"
              style={{ width: "20%" }}
            />
            <Column
              style={{ width: "5%" }}
              field="quantity"
              header="Quantity"
            />
            <Column
              style={{ width: "10%" }}
              body={StatusTemplate}
              field="status"
              header="Status"
            />
            <Column
              style={{ width: "15%" }}
              body={DateTemplate}
              field="ordered_at"
              header="Order Date"
            />
            <Column
              style={{ width: "25%" }}
              field="notes"
              body={NoteTemplate}
              header="Special Note"
            />
            <Column
              style={{ width: "10%" }}
              header="Action"
              body={(e: IOrderData) => <OrderOverlayButton value={e} />}
            />
          </DataTable>
          <Pagination
            count={count}
            next={next}
            previous={previous}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrderTable;