import { MapPin, User2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import outofstock from "@/public/outofstock.png";
import Link from "next/link";

const ProductCard = ({ product }: { product: ICrop }) => {
  const isAvailable = product.availability?.toLowerCase() === "available";
  const imageSrc = isAvailable && product.img ? product.img : outofstock.src;

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group rounded-2xl border border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-green-100"
    >
      {/* Image */}
      <div className="relative w-full h-[160px] bg-gray-50 overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${product.crop_name} image`}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = outofstock.src;
          }}
        />
        {/* Availability badge */}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {/* Name */}
        <h4 className="font-inter font-semibold text-sm text-gray-900 capitalize leading-snug">
          {product.crop_name}
        </h4>

        {/* Farmer */}
        <div className="flex items-center gap-1.5">
          <User2 size={13} className="text-green-600 shrink-0" />
          <span className="font-inter text-xs text-green-700 capitalize truncate">
            {product.farmer_name}
          </span>
        </div>

        {/* Price */}
        <p className="font-inter font-bold text-base text-green-800">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(Number(product.price_per_unit))}
          <span className="text-xs font-normal text-gray-400">
            /{product.unit?.name}
          </span>
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          {product.location ? (
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin size={11} />
              <span className="text-xs truncate max-w-[80px]">
                {product.location}
              </span>
            </div>
          ) : (
            <span />
          )}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
              isAvailable
                ? "bg-yellow-400 text-green-900 group-hover:bg-yellow-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Order
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;