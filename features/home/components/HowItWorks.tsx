import Image from "next/image";
import { Checkbox } from "primereact/checkbox";
import React from "react";

const HowItWorks = () => {
  return (
    <div className={`py-20 flex flex-col gap-20 px-3 md:px-10 bg-white`}>
      <h3
        className={`font-square text-4xl text-center text-primary font-semibold uppercase underline`}
      >
        How it Works
      </h3>
      <div className={`max-w-7xl flex flex-col gap-10 mx-auto w-full `}>
        <div
          className={`flex flex-col .border border-gray-300 .rounded-2xl sm:flex-row justify-center .items-center font-semibold overflow-hidden lg:h-[400px] gap-5`}
        >
          <Image
            src={`/FarmerUpload.png`}
            alt="food Basket"
            width={400}
            height={400}
            className={` rounded-2xl sm:w-[300px] w-full h-inherit lg:w-full`}
          />
          <div
            className={`w-full py-5 flex px-3 lg:px-7 flex-col gap-4 lg:gap-7`}
          >
            <h5
              className={`font-square text-3xl md:text-3xl lg:text-4xl text-primary`}
            >
              Farmers List Fresh Farm Products Online
            </h5>
            <p className={`font-inter text-black text-lg font-semibold`}>
              Local farmers sign up and upload their available farm produce,
              including fruits, vegetables, grains, and livestock, with clear
              photos, descriptions, and prices. This makes it easy for buyers to
              access fresh farm products directly from the source.
            </p>
          </div>
        </div>
        <div
          className={`flex flex-col .border border-gray-300 .rounded-2xl sm:flex-row-reverse justify-center .items-center font-semibold overflow-hidden lg:h-[400px] gap-5`}
        >
          <Image
            src={`/customer.png`}
            alt="Customer browsing a phone"
            width={400}
            height={400}
            className={`rounded-2xl sm:w-[300px] w-full h-inherit lg:w-full`}
          />
          <div
            className={`w-full py-5 flex px-3 lg:px-7 flex-col gap-4 lg:gap-7`}
          >
            <h5
              className={`font-square text-3xl md:text-3xl lg:text-4xl text-primary`}
            >
              Buyers Discover and Order Farm Produce Easily
            </h5>
            <p className={`font-inter text-black text-lg font-semibold`}>
              Buyers can browse through a wide variety of farm products listed
              by verified farmers. Using our user-friendly platform, they can
              search, compare, and order farm goods online — either for personal
              consumption, resale, or processing.
            </p>
          </div>
        </div>
        <div
          className={`flex flex-col .border border-gray-300 .rounded-2xl sm:flex-row justify-center .items-center font-semibold overflow-hidden lg:h-[400px] gap-5`}
        >
          <Image
            src={`/delivery.png`}
            alt="A guy deliverying fruits"
            width={400}
            height={400}
            className={`rounded-2xl sm:w-[300px] w-full h-inherit lg:w-full`}
          />
          <div
            className={`w-full py-5 flex px-3 lg:px-7 flex-col gap-4 lg:gap-7`}
          >
            <h5
              className={`font-square text-3xl md:text-3xl lg:text-4xl text-primary`}
            >
              Transporters Deliver from Farm to Market or Buyer
            </h5>
            <p className={`font-inter text-black text-lg font-semibold`}>
              Once a buyer places an order, nearby transporters receive delivery
              requests. They pick up goods from the farm and deliver:
            </p>
            <div className={`flex flex-col gap-2`}>
              <div className={`flex items-center gap-2`}>
                <Checkbox checked ></Checkbox>
                <label className={`text-black text-lg font-inter`} htmlFor="">
                  Directly to the buyer&apos;s location
                </label>
              </div>
              <div className={`flex items-center gap-2`}>
                <Checkbox checked></Checkbox>
                <label className={`text-black text-lg font-inter`} htmlFor="">
                  To a designated market or warehouse
                </label>
              </div>
              <div className={`flex items-center gap-2`}>
                <Checkbox checked></Checkbox>
                <label className={`text-black text-lg font-inter`} htmlFor="">
                  From the market to the buyer&apos;s home or business
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
