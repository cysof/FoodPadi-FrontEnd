// features/transporter/components/DeliveryList.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetAllDeliveriesQuery } from "../data/TransporterApi";
import { clearTransporterErrors } from "../data/TransporterSlice";
import { enqueueSnackbar } from "notistack";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import DeliveryCard from "./DeliveryCard";
import { Pagination, DeliveryCardSkeletonGrid, EmptyState } from "@/components";
import { Truck } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);

  const deliveries = useAppSelector(
    (state) => state.transporter.deliveries
  );
  const getAllDeliveriesLoading = useAppSelector(
    (state) => state.transporter.getAllDeliveriesLoading
  );
  const getAllDeliveriesError = useAppSelector(
    (state) => state.transporter.getAllDeliveriesError
  );
  const count = useAppSelector((state) => state.transporter.count);
  const next = useAppSelector((state) => state.transporter.next);
  const previous = useAppSelector((state) => state.transporter.previous);

  const query = {
    ...(statusFilter ? { status: statusFilter } : {}),
    page: currentPage,
  };

  useGetAllDeliveriesQuery(query);

  useEffect(() => {
    if (getAllDeliveriesError) {
      enqueueSnackbar(getAllDeliveriesError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [getAllDeliveriesError]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className={`flex flex-col gap-5`}>
      {/* Filter */}
      <div className={`flex items-center gap-3`}>
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => handleStatusChange(e.value)}
          placeholder="Filter by status"
          className={`w-full sm:max-w-[200px]`}
        />
      </div>

      {/* Content */}
      {getAllDeliveriesLoading ? (
        <DeliveryCardSkeletonGrid count={6} />
      ) : !getAllDeliveriesLoading && deliveries.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No Deliveries Yet"
          message="You have not been assigned any deliveries yet. Make sure your account is active and available to receive delivery assignments."
        />
      ) : (
        <div className={`flex flex-col gap-4`}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}
          >
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </div>
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

export default DeliveryList;