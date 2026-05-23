// features/transporter/components/DeliveryCard.tsx
"use client";

import { MapPin, Calendar, Package } from "lucide-react";
import Link from "next/link";

const DeliveryStatusBadge = ({ status }: { status: string }) => {
  const color =
    status === "PENDING"
      ? "bg-yellow-400"
      : status === "ACCEPTED"
      ? "bg-blue-400"
      : status === "ON_THE_WAY"
      ? "bg-sky-500"
      : status === "DELIVERED"
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <span className={`text-xs text-white px-3 py-1 rounded-full ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const DeliveryCard = ({ delivery }: { delivery: ITransporterDelivery }) => {
  return (
    <Link
      href={`/dashboard/deliveries/${delivery.id}`}
      className={`flex flex-col gap-3 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between`}>
        <h4 className={`font-square font-semibold text-lg text-primary-black capitalize`}>
          {delivery.crop_name}
        </h4>
        <DeliveryStatusBadge status={delivery.delivery_status} />
      </div>

      {/* Buyer */}
      <div className={`flex items-center gap-2`}>
        <Package width={16} className={`text-primary shrink-0`} />
        <p className={`font-inter text-sm text-gray-600`}>
          Buyer: {delivery.buyer_name}
        </p>
      </div>

      {/* Delivery Address */}
      <div className={`flex items-center gap-2`}>
        <MapPin width={16} className={`text-primary shrink-0`} />
        <p className={`font-inter text-sm text-gray-600 line-clamp-1`}>
          {delivery.delivery_address}
        </p>
      </div>

      {/* Delivery Date */}
      <div className={`flex items-center gap-2`}>
        <Calendar width={16} className={`text-primary shrink-0`} />
        <p className={`font-inter text-sm text-gray-600`}>
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(delivery.delivery_date))}
        </p>
      </div>
    </Link>
  );
};

export default DeliveryCard;