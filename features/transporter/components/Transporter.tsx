// features/transporter/components/Transporter.tsx
"use client";

import React from "react";
import DeliveryList from "./DeliveryList";

const Transporter = () => {
  return (
    <div
      className={`bg-white overflow-y-scroll pb-10 w-full shrink h-full flex-col flex gap-7 px-3`}
    >
      <div className={`flex flex-col py-5 gap-1`}>
        <h2
          className={`font-square font-bold text-3xl leading-[40px] text-primary-black`}
        >
          My Deliveries
        </h2>
        <p className={`font-inter font-normal text-sm text-primary-black`}>
          Manage and update your assigned deliveries here.
        </p>
      </div>
      <DeliveryList />
    </div>
  );
};

export default Transporter;