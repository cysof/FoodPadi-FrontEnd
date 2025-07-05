"use client";

import { useAppSelector } from "@/store/hooks";
import { Button } from "primereact/button";
import React from "react";

const OrderPage = () => {
  const order = useAppSelector((state) => state.orderById.order);
  return (
    <div className={`flex flex-col gap-8`}>
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
          Order summary
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
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.status}
            </p>
          </div>
        </div>
      </div>
      <div className={`flex flex-col gap-2`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Delivery information
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
              Special note
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.notes ? order?.notes : `N/A`}
            </p>
          </div>
        </div>
      </div>
      <div className={`flex flex-col-reverse sm:flex-row justify-center sm:items-center gap-4 mt-5`}>
        <Button outlined className={`danger`} label={`Cancel Order`} />
        <Button className={`primary`} label={`Accept Order`} />
      </div>
    </div>
  );
};

export default OrderPage;
