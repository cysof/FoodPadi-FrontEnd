// features/transporter/components/DeliveryList.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetAllDeliveriesQuery } from "../data/TransporterApi";
import { clearTransporterErrors } from "../data/TransporterSlice";
import { enqueueSnackbar } from "notistack";
import { Loader2 } from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import DeliveryCard from "./DeliveryCard";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "On The Way", value: "ON_THE_WAY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const DeliveryList = () => {
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState("");

  const deliveries = useAppSelector(
    (state) => state.transporter.deliveries
  );
  const getAllDeliveriesLoading = useAppSelector(
    (state) => state.transporter.getAllDeliveriesLoading
  );
  const getAllDeliveriesError = useAppSelector(
    (state) => state.transporter.getAllDeliveriesError
  );

  const query = {
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  useGetAllDeliveriesQuery(query);

  useEffect(() => {
    if (getAllDeliveriesError) {
      enqueueSnackbar(getAllDeliveriesError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [getAllDeliveriesError]);

  return (
    <div className={`flex flex-col gap-5`}>
      {/* Filter */}
      <div className={`flex items-center gap-3`}>
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => setStatusFilter(e.value)}
          placeholder="Filter by status"
          className={`w-full sm:max-w-[200px]`}
        />
      </div>

      {/* Content */}
      {getAllDeliveriesLoading ? (
        <div className={`w-full h-40 flex items-center justify-center`}>
          <Loader2 className={`animate-spin text-primary`} />
        </div>
      ) : deliveries.length === 0 ? (
        <div
          className={`w-full h-40 flex items-center justify-center`}
        >
          <p className={`font-inter text-sm text-gray-500 text-center`}>
            No deliveries assigned yet
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}
        >
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryList;