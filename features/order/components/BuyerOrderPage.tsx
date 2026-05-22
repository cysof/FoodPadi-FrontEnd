// features/order/components/BuyerOrderPage.tsx
"use client";

import { useAppSelector } from "@/store/hooks";
import { Status } from "@/features/order/types/order.types";
import { PhoneCall, User2, Truck } from "lucide-react";
import Image from "next/image";

const DeliveryTimeline = ({ delivery }: { delivery: IDeliveryInfo }) => {
  const steps = [
    {
      label: "Order Accepted",
      time: delivery.accepted_at,
      done: !!delivery.accepted_at,
    },
    {
      label: "On The Way",
      time: delivery.on_the_way_at,
      done: !!delivery.on_the_way_at,
    },
    {
      label: "Delivered",
      time: delivery.delivered_at,
      done: !!delivery.delivered_at,
    },
  ];

  return (
    <div className={`flex flex-col gap-3`}>
      {steps.map((step, index) => (
        <div key={index} className={`flex items-center gap-3`}>
          <div
            className={`h-4 w-4 rounded-full shrink-0 ${
              step.done ? `bg-primary` : `bg-gray-300`
            }`}
          />
          <div className={`flex flex-col`}>
            <span
              className={`font-inter text-sm font-medium ${
                step.done ? `text-primary` : `text-gray-400`
              }`}
            >
              {step.label}
            </span>
            {step.time && (
              <span className={`font-inter text-xs text-gray-400`}>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(step.time))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

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

      {/* Transporter Information */}
      {order?.delivery ? (
        <div className={`flex flex-col gap-4`}>
          <h3 className={`font-square font-bold text-xl text-primary-black`}>
            Transporter Information
          </h3>
          <div
            className={`flex flex-col sm:flex-row gap-4 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
          >
            <div className={`flex flex-col gap-3 flex-1`}>
              <div className={`flex items-center gap-2`}>
                <User2 width={18} className={`text-primary`} />
                <p className={`font-inter text-sm text-primary-black`}>
                  {order.delivery.transporter_name}
                </p>
              </div>
              <div className={`flex items-center gap-2`}>
                <PhoneCall width={18} className={`text-primary`} />
                <p className={`font-inter text-sm text-primary-black`}>
                  {order.delivery.transporter_phone}
                </p>
              </div>
              <div className={`flex items-center gap-2`}>
                <Truck width={18} className={`text-primary`} />
                <span
                  className={`text-xs text-white px-3 py-1 rounded-full ${
                    order.delivery.delivery_status === "PENDING"
                      ? `bg-yellow-400`
                      : order.delivery.delivery_status === "ACCEPTED"
                      ? `bg-blue-400`
                      : order.delivery.delivery_status === "ON_THE_WAY"
                      ? `bg-sky-500`
                      : order.delivery.delivery_status === "DELIVERED"
                      ? `bg-green-500`
                      : `bg-red-500`
                  }`}
                >
                  {order.delivery.delivery_status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className={`flex flex-col gap-2 flex-1`}>
              <h5 className={`font-square font-medium text-sm text-primary`}>
                Delivery Timeline
              </h5>
              <DeliveryTimeline delivery={order.delivery} />
            </div>
          </div>

          {/* Proof of Delivery */}
          {order.delivery.proof_of_delivery_image && (
            <div className={`flex flex-col gap-2`}>
              <h5 className={`font-square font-medium text-lg text-primary`}>
                Proof of Delivery
              </h5>
              <Image
                src={order.delivery.proof_of_delivery_image}
                alt="Proof of delivery"
                width={300}
                height={200}
                className={`rounded-2xl object-cover`}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex flex-col gap-1 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm`}
        >
          <h5 className={`font-square font-medium text-lg text-primary`}>
            Transporter Information
          </h5>
          <p className={`font-inter font-normal text-sm text-gray-500`}>
            No transporter assigned yet. Please check back later.
          </p>
        </div>
      )}

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