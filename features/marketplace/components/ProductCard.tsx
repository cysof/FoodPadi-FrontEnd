import { User2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import outofstock from "@/public/outofstock.png";
import Link from "next/link";

const ProductCard = ({ product }: { product: ICrop }) => {
  return (
    <Link
      href={`/marketplace/${product.id}`}
      className={`rounded-2xl hover:scale-105 duration-300 border bg-white border-gray-300 flex flex-col gap-3 pb-3`}
    >
      <div
        className={`relative overflow-hidden border-b rounded-2xl w-full h-[176px]`}
      >
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
      <div className={`flex-1 px-3 flex flex-col gap-2`}>
        <h4 className={`font-square font-medium capitalize text-lg text-black`}>
          {product.crop_name}
        </h4>
        <div className={`flex items-center gap-1`}>
          <User2 color="#4caf50" width={20} />
          <span
            className={`font-inter text-primary font-normal capitalize text-sm `}
          >
            {product.farmer_name}
          </span>
        </div>

        <p className={`font-inter font-normal text-sm text-primary`}>
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(Number(product.price_per_unit))}
          /{product.unit}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
