import { Calendar, MapPin, User2 } from "lucide-react";
import Image from "next/image";
import { Button } from "primereact/button";
import React from "react";
import outofstock from "@/public/outofstock.png";

const ProductCard = ({ product }: { product: ICrop }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-300 flex flex-col gap-3 px-3 py-3`}
    >
      <div className={`relative border border-gray-300 rounded-xl w-full h-52`}>
        <Image
          src={
            product.availability.toLowerCase() === "available"
              ? product.img
              : outofstock.src
          }
          alt={`${product.crop_name} image`}
          fill
        />
      </div>
      <div className={`flex-1 flex flex-col gap-3`}>
        <div>
          <h4
            className={`font-square font-semibold capitalize text-xl text-black`}
          >
            {product.crop_name}
          </h4>
          <p className={`text-sm font-inter text-gray-500 line-clamp-2`}>
            {product.crop_description}
          </p>
        </div>
        <div>
          <p className={`font-inter font-semibold text-xl text-black`}>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(Number(product.price_per_unit))}
            /{product.unit}
          </p>
          <p className={`text-gray-600 font-normal font-inter text-sm`}>
            {product.quantity} available
          </p>
        </div>
        <div className={`flex items-center justify-between gap-2 text-black`}>
          <div className={`flex items-center gap-1`}>
            <MapPin color="gray" width={20} />
            <span>{product.location}</span>
          </div>
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              product.availability.toLowerCase() === `available`
                ? `bg-primary/30 text-primary`
                : `bg-red-500/30 text-red-500`
            }`}
          >
            {product.availability}
          </span>
        </div>
        <div className={`flex items-center gap-1`}>
          <Calendar color="gray" width={20} />
          <span
            className={`font-inter font-normal capitalize text-sm text-black`}
          >
            harvested on{" "}
            {new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(product.harvested_date))}
          </span>
        </div>
        <div className={`flex items-center gap-1`}>
          <User2 color="gray" width={20} />
          <span
            className={`font-inter font-normal capitalize text-sm text-black`}
          >
            {product.farmer_name}
          </span>
        </div>
      </div>
      <Button
        disabled={
          product.availability.toLowerCase() === `available` ? false : true
        }
        className={`flex justify-center font-square font-bold ${
          product.availability.toLowerCase() === `available` ? `buy` : `out`
        }`}
      >
        Buy Now
      </Button>
    </div>
  );
};

export default ProductCard;
