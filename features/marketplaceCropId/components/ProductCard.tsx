// features/marketplace/components/ProductCard.tsx
"use client";

import { User2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import outofstock from "@/public/outofstock.png";
import Link from "next/link";

interface ICrop {
  id: string | number;
  crop_name: string;
  img?: string | null;
  availability: string;
  farmer_name?: string;
  price_per_unit: number;
  unit: string;
}

const ProductCard = ({ product }: { product: ICrop }) => {
  const [imageError, setImageError] = useState(false);
  const isAvailable = product.availability?.toLowerCase() === "available";
  
  // Determine image source - never empty string
  let imageSrc = outofstock.src;
  if (isAvailable && product.img && product.img.trim() !== "") {
    imageSrc = product.img;
  }

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="rounded-2xl hover:scale-105 duration-300 border bg-white border-gray-300 flex flex-col gap-3 pb-3 overflow-hidden"
    >
      <div className="relative overflow-hidden bg-gray-100 w-full h-[176px]">
        <Image
          src={imageError ? outofstock.src : imageSrc}
          alt={`${product.crop_name} image`}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex-1 px-3 flex flex-col gap-2">
        <h4 className="font-square font-medium capitalize text-lg text-black line-clamp-1">
          {product.crop_name}
        </h4>
        <div className="flex items-center gap-1">
          <User2 color="#4caf50" width={20} />
          <span className="font-inter text-primary font-normal capitalize text-sm line-clamp-1">
            {product.farmer_name || "Unknown Farmer"}
          </span>
        </div>
        <p className="font-inter font-normal text-sm text-primary">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(Number(product.price_per_unit || 0))}
          /{product.unit || "unit"}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;