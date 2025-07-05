"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import React from "react";
// import { useLazyGetOneProductQuery } from "../data/MarketCropIDApi";
import { usePathname } from "next/navigation";
import outofstock from "@/public/outofstock.png";
import OrderForm from "./OrderForm";
import Link from "next/link";

const Crop = () => {
  const path = usePathname();

  const crop = useAppSelector((state) => state.marketPlaceCrop.product);
  const user = useAppSelector((state) => state.login);

  return (
    <div
      className={`w-full flex flex-col px-3 md:px-5 lg:px-10 gap-7 max-w-7xl mx-auto`}
    >
      {/* <div className={`border border-red-800 w-full .max-w-[428px] h-[619px] relative`}> */}
      <Image
        height={619}
        width={928}
        className={` aspect-video w-full .mx-auto rounded-2xl`}
        src={
          crop?.availability.toLowerCase() === "available"
            ? crop?.img
            : outofstock.src
        }
        alt={`${crop?.crop_name} image`}
      />
      {/* </div> */}
      <div className={`flex flex-col gap-3`}>
        <div className={`flex flex-col gap-2`}>
          <h3
            className={`font-square capitalize font-bold text-2xl text-primary-black`}
          >
            {crop?.crop_name}
          </h3>
          <p className={`font-normal text-sm text-primary`}>
            Produced by {crop?.farmer_name}
          </p>
        </div>
        <p
          className={`font-inter font-normal max-w-4xl w-full leading-[24px] text-primary-black`}
        >
          {crop?.crop_description}
        </p>
      </div>
      <div
        className={`flex flex-col sm:flex-row item-centerv gap-3 justify-between max-w-2xl w-full`}
      >
        <div>
          <h4 className={`font-square text-sm text-primary`}>Price per unit</h4>
          <p className={`font-inter text-sm text-primary-black`}>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(Number(crop?.price_per_unit))}
            /{crop?.unit}
          </p>
        </div>
        <div>
          <h4 className={`font-square text-sm text-primary`}>
            Available quantity
          </h4>
          <p className={`font-inter text-sm text-primary-black`}>
            {crop?.quantity}
          </p>
        </div>
        <div>
          <h4 className={`font-square text-sm text-primary`}>Harvest date</h4>
          <p className={`font-inter text-sm text-primary-black`}>
            {crop?.harvested_date &&
              new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(crop.harvested_date))}
          </p>
        </div>
      </div>
      <div className={`w-full`}>
        {crop?.availability.toLowerCase() === "out of stock" ? (
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-red-700`}>
              This crop is currently out of stock.
            </h5>
            <p className={`font-inter font-normal text-sm text-red-700`}>
              Please check back later — we’re working on restocking it!
            </p>
          </div>
        ) : user.token && user?.user.id ? (
          <OrderForm />
        ) : (
          <Link
            className={`w-full bg-primary hover:bg-primary/95 text-sm mx-auto max-w-md px-3 py-3 rounded-sm`}
            href={`/auth/login?url=${path}`}
          >
            Login to Place Order
          </Link>
        )}
      </div>
    </div>
  );
};

export default Crop;
