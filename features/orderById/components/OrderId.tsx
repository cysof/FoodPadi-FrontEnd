"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import React from "react";
import OrderPage from "./OrderPage";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetOneOrderQuery } from "../data/OrderIDApi";
import { enqueueSnackbar } from "notistack";
import { clearOrderByIdError } from "../data/OrderIDSlice";

const OrderId = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = useParams<{ orderId: string }>();

  useGetOneOrderQuery({ id: +orderId.orderId });

  const getOneOrderLoading = useAppSelector(
    (state) => state.orderById.getOneOrderLoading
  );
  const getOneOrderError = useAppSelector(
    (state) => state.orderById.getOneOrderError
  );

  if (getOneOrderError) {
    enqueueSnackbar(getOneOrderError, { variant: "error" });
    dispatch(clearOrderByIdError());
  }

  return (
    <div className="flex bg-white flex-col gap-10 w-full px-3 md:px-5 lg:px-10 md:py-10 py-5 overflow-y-auto pb-10 shrink h-full">
      <span
        onClick={() => router.push("/dashboard/orders")}
        className={`h-6 w-6 flex items-center justify-center rounded-full bg-primary cursor-pointer`}
      >
        <ArrowLeft color="white" width={18} />
      </span>
      {getOneOrderLoading ? (
        <div className={`w-full h-svh flex items-center justify-center`}>
          <Loader2 className={`animate-spin text-primary duration-300`} />
        </div>
      ) : (
        <OrderPage />
      )}
    </div>
  );
};

export default OrderId;
