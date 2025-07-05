import React from "react";
import OrderTable from "./OrderTable";

const Order = () => {
  return (
    <div
      className={`bg-white overflow-y-scroll pb-10 w-full shrink h-full flex-col flex gap-7 px-3`}
    >
      <div className={`flex flex-col py-5 gap-1`}>
        <h2
          className={`font-square font-bold text-3xl leading-[40px] text-primary-black`}
        >
          Order Management
        </h2>
        <p className={`font-inter font-normal text-sm text-primary-black`}>
          Manage and process incoming orders from buyers.
        </p>
      </div>
      <OrderTable />
    </div>
  );
};

export default Order;
