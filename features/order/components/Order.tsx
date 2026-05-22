// features/order/components/Order.tsx
"use client";

import React from "react";
import OrderTable from "./OrderTable";
import BuyerOrderTable from "./BuyerOrderTable";
import { useAppSelector } from "@/store/hooks";

const Order = () => {
  const user = useAppSelector((state) => state.login.user);
  const accountType = user?.account_type?.toUpperCase();

  return (
    <div
      className={`bg-white overflow-y-scroll pb-10 w-full shrink h-full flex-col flex gap-7 px-3`}
    >
      <div className={`flex flex-col py-5 gap-1`}>
        <h2
          className={`font-square font-bold text-3xl leading-[40px] text-primary-black`}
        >
          {accountType === "BUYER" ? "My Orders" : "Order Management"}
        </h2>
        <p className={`font-inter font-normal text-sm text-primary-black`}>
          {accountType === "BUYER"
            ? "Track and manage your orders here."
            : "Manage and process incoming orders from buyers."}
        </p>
      </div>
      {accountType === "BUYER" ? <BuyerOrderTable /> : <OrderTable />}
    </div>
  );
};

export default Order;