"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import React, { useState } from "react";
import outofstock from "@/public/outofstock.png";
import OrderForm from "./OrderForm";
import Link from "next/link";
import { ArrowLeft, User2, Calendar, Package, MapPin, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!crop) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-inter">Loading crop details...</p>
      </div>
    );
  }

  const isAvailable = crop?.availability?.toLowerCase() === "available";
  const coverImage = getImageSrc(crop?.img, isAvailable);
  const activeImage = selectedImage || coverImage;

  const allImages = [
    { id: 0, image_url: coverImage },
    ...(crop.additional_images || []).map((img: any, idx: number) => ({
      id: img.id || idx + 1,
      image_url: img.image_url || img,
    })),
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 py-6 px-4 pt-20">
      <div className="max-w-5xl mx-auto">

        {/* Back link */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-6 text-sm font-medium font-inter transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </Link>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* Left — Image gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden bg-gray-100">
              <Image
                fill
                className="object-cover"
                src={imageError ? outofstock.src : activeImage}
                alt={crop.crop_name || "Crop image"}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isAvailable ? "✓ In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setSelectedImage(img.image_url);
                      setImageError(false);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img.image_url
                        ? "border-green-600"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${crop.crop_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = outofstock.src;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product details */}
          <div className="flex flex-col gap-5">

            {/* Title + farmer */}
            <div>
              <h1 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 capitalize mb-2">
                {crop.crop_name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <User2 size={14} className="text-green-700" />
                </div>
                <span className="font-inter text-sm text-green-700 font-medium capitalize">
                  {crop.farmer_name || "Unknown Farmer"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2">
              <span className="font-inter font-bold text-3xl text-green-800">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(Number(crop.price_per_unit || 0))}
              </span>
              <span className="text-gray-400 text-sm mb-1 font-inter">
                /{crop.unit || "unit"}
              </span>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                <Package size={15} className="text-green-600 shrink-0" />
                <span className="font-inter text-xs text-gray-600">
                  {crop.quantity || 0} {crop.unit || "units"} available
                </span>
              </div>
              {crop.harvested_date && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <Calendar size={15} className="text-green-600 shrink-0" />
                  <span className="font-inter text-xs text-gray-600">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(crop.harvested_date))}
                  </span>
                </div>
              )}
              {crop.location && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <MapPin size={15} className="text-green-600 shrink-0" />
                  <span className="font-inter text-xs text-gray-600 truncate">
                    {crop.location}
                  </span>
                </div>
              )}
              {crop.is_Organic !== undefined && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <Leaf size={15} className="text-green-600 shrink-0" />
                  <span className="font-inter text-xs text-gray-600">
                    {crop.is_Organic ? "Organic" : "Conventional"}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {crop.crop_description && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2 font-inter">
                  About this product
                </p>
                <p className="font-inter text-sm text-gray-600 leading-relaxed">
                  {crop.crop_description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order section — full width */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-inter font-bold text-lg text-gray-900 mb-5 pb-4 border-b border-gray-100">
            🛒 Place Your Order
          </h2>
          {!isAvailable ? (
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-red-700 text-sm font-medium font-inter">
                This product is currently out of stock
              </p>
            </div>
          ) : user.token && user?.user?.id ? (
            <OrderForm />
          ) : (
            <Link
              className="block w-full bg-yellow-400 hover:bg-yellow-300 text-green-900 text-center py-3 rounded-xl transition-colors font-inter font-semibold"
              href={`/auth/login?url=${path}`}
            >
              Login to Place Order
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};

export default Crop;