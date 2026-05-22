// features/order/components/BuyerOrderPage.tsx
"use client";

import { useAppSelector } from "@/store/hooks";
import { Status } from "../types/order.types";

const BuyerOrderPage = () => {
  const order = useAppSelector((state) => state.orderById.order);

  return (
    <div className={`flex flex-col gap-8`}>
      <h3 className={`font-square font-bold text-3xl text-primary-black`}>
        Order #{order?.id}
      </h3>

      {/* Order Summary */}
      <div className={`flex flex-col gap-2`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Order Summary
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
            <span
              className={`w-max text-xs text-white px-3 py-1 rounded-full ${
                order?.status === Status.PENDING
                  ? `bg-yellow-400`
                  : order?.status === Status.CONFIRMED
                  ? `bg-blue-500`
                  : order?.status === Status.SHIPPED
                  ? `bg-sky-500`
                  : order?.status === Status.DELIVERED
                  ? `bg-green-500`
                  : `bg-red-500`
              }`}
            >
              {order?.status}
            </span>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Order Date
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.ordered_at &&
                new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(order.ordered_at))}
            </p>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Price Per Unit
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(Number(order?.price_per_unit))}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className={`flex flex-col gap-2`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Delivery Information
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
              Special Note
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {order?.notes ? order?.notes : `N/A`}
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Reason */}
      {order?.status === Status.CANCELLED && order?.cancel_reason && (
        <div className={`flex flex-col gap-1`}>
          <h5 className={`font-square font-medium text-lg text-red-600`}>
            Cancellation Reason
          </h5>
          <p className={`font-inter font-normal text-sm text-red-500`}>
            {order?.cancel_reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyerOrderPage;