// features/marketplaceCropId/components/Crop.tsx (Compact Version)
"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import outofstock from "@/public/outofstock.png";
import OrderForm from "./OrderForm";
import Link from "next/link";
import { ArrowLeft, User2, Calendar, Package, MapPin, Leaf } from "lucide-react";

const getImageSrc = (img: string | undefined | null, isAvailable: boolean): string => {
  if (!isAvailable) return outofstock.src;
  if (!img || img.trim() === "") return outofstock.src;
  
  let imageUrl = img;
  if (imageUrl.startsWith("http://")) {
    imageUrl = imageUrl.replace("http://", "https://");
  }
  
  return imageUrl;
};

const Crop = () => {
  const path = usePathname();
  const crop = useAppSelector((state) => state.marketPlaceCrop.product);
  const user = useAppSelector((state) => state.login);
  const [imageError, setImageError] = useState(false);

  if (!crop) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading crop details...</p>
      </div>
    );
  }

  const isAvailable = crop?.availability?.toLowerCase() === "available";
  const imageSrc = getImageSrc(crop?.img, isAvailable);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4 text-sm transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Marketplace
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Image */}
          <div className="relative w-full bg-gray-100 h-64 md:h-80">
            <Image
              fill
              className="object-contain p-4"
              src={imageError ? outofstock.src : imageSrc}
              alt={crop.crop_name || "Crop image"}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title & Farmer */}
            <div className="mb-4">
              <h1 className="font-bold text-2xl text-gray-900 mb-1">
                {crop.crop_name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <User2 size={16} />
                <span className="text-sm">{crop.farmer_name || "Unknown Farmer"}</span>
              </div>
            </div>

            {/* Price & Availability */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(Number(crop.price_per_unit || 0))}
                </span>
                <span className="text-gray-500">/{crop.unit || "unit"}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isAvailable ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={16} />
                <span>{crop.quantity || 0} {crop.unit || "units"} available</span>
              </div>
              {crop.harvested_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(crop.harvested_date))}
                  </span>
                </div>
              )}
              {crop.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{crop.location}</span>
                </div>
              )}
              {crop.is_Organic !== undefined && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Leaf size={16} />
                  <span>{crop.is_Organic ? "Organic" : "Conventional"}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {crop.crop_description && (
              <div className="mb-5 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {crop.crop_description}
                </p>
              </div>
            )}

            {/* Order Section */}
            <div className="pt-2">
              {!isAvailable ? (
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-red-700 text-sm font-medium">Currently Out of Stock</p>
                </div>
              ) : user.token && user?.user?.id ? (
                <OrderForm />
              ) : (
                <Link
                  className="block w-full bg-primary hover:bg-primary/90 text-white text-center py-3 rounded-lg transition-colors font-medium"
                  href={`/auth/login?url=${path}`}
                >
                  Login to Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crop;