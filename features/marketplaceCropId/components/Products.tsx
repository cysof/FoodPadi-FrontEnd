// features/marketplace/components/ProductCard.tsx (Defensive version)
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";

interface ProductCardProps {
  product: {
    id: string | number;
    crop_name: string;
    img?: string | null;
    image_url?: string | null;
    thumbnail_url?: string | null;
    price_per_unit: number;
    unit: string;
    quantity: number;
    availability: string;
    farmer_name?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Use useMemo to compute the image source
  const imageSource = useMemo(() => {
    if (!product) {
      console.log("No product");
      return null;
    }

    const isAvailable = product.availability?.toLowerCase() === "available";
    
    if (!isAvailable) {
      console.log("Product not available");
      return null;
    }

    // Get the first valid image URL
    const imageUrl = product.img || product.image_url || product.thumbnail_url;
    
    if (!imageUrl || imageUrl.trim() === "") {
      console.log("Empty or missing image URL");
      return null;
    }

    // Clean and return the URL
    let cleanUrl = imageUrl.trim();
    if (cleanUrl.startsWith("http://")) {
      cleanUrl = cleanUrl.replace("http://", "https://");
    }
    
    console.log("Using image URL:", cleanUrl);
    return cleanUrl;
  }, [product]);

  // Don't render Image at all if no valid source
  const renderImage = () => {
    if (imageError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">Image error</span>
        </div>
      );
    }

    if (!imageSource) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">No image</span>
        </div>
      );
    }

    return (
      <Image
        src={imageSource}
        alt={product.crop_name || "Product image"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => {
          console.error("Image failed to load:", imageSource);
          setImageError(true);
        }}
        onLoad={() => {
          console.log("Image loaded:", imageSource);
          setImageError(false);
        }}
      />
    );
  };

  const isAvailable = product?.availability?.toLowerCase() === "available";

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        {renderImage()}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {product.crop_name || "Unknown Product"}
        </h3>
        
        <p className="text-sm text-gray-600 mt-1">
          {product.farmer_name || "Unknown Farmer"}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-green-600">
              ₦{Number(product.price_per_unit || 0).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500"> /{product.unit || "unit"}</span>
          </div>
          
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Quantity: {product.quantity || 0} {product.unit || "units"}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;