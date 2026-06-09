import React from "react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    role: "For Farmers",
    roleColor: "text-green-700",
    numBg: "bg-green-100 text-green-800",
    title: "List Fresh Farm Products Online",
    description:
      "Sign up and upload your available produce — fruits, vegetables, grains, and livestock — with photos, descriptions, and prices. Reach thousands of buyers directly from your farm.",
    image: "/FarmerUpload.png",
    imageAlt: "Farmer uploading products",
    reverse: false,
    pills: [],
    connector: true,
  },
  {
    number: "02",
    role: "For Buyers",
    roleColor: "text-yellow-700",
    numBg: "bg-yellow-100 text-yellow-800",
    title: "Discover and Order Farm Produce Easily",
    description:
      "Browse a wide variety of fresh products from verified farmers. Search, compare, and order online — whether for personal use, resale, or processing.",
    image: "/customer.png",
    imageAlt: "Customer browsing on phone",
    reverse: true,
    pills: [],
    connector: true,
  },
  {
    number: "03",
    role: "For Transporters",
    roleColor: "text-green-700",
    numBg: "bg-green-100 text-green-800",
    title: "Deliver from Farm to Market or Buyer",
    description:
      "Get automatically paired with nearby delivery requests. Pick up goods from the farm and deliver to the right destination.",
    image: "/delivery.png",
    imageAlt: "Transporter delivering fruits",
    reverse: false,
    pills: [
      "Direct to buyer",
      "To market or warehouse",
      "Market to home delivery",
    ],
    connector: false,
  },
];

const HowItWorks = () => {
  return (
    // Change py-20 to pt-12 pb-20
<div id="how-it-works" className="pt-12 pb-20 flex flex-col gap-16 px-3 md:px-10 bg-white">

      {/* Section Header */}
      <div className="flex flex-col items-center gap-3">
        <span className="bg-green-100 text-green-800 text-xs font-semibold font-inter px-4 py-1.5 rounded-full uppercase tracking-wide">
          Simple 3-step process
        </span>
        <h3 className="font-inter text-3xl md:text-4xl text-center text-primary font-bold uppercase">
          How It Works
        </h3>
        <p className="text-gray-500 text-center text-base max-w-md font-inter leading-relaxed">
          From farm to your doorstep — here's how Micro FoodBank makes it happen.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col gap-6">

            {/* Step Card */}
            <div
              className={`flex flex-col ${
                step.reverse ? "sm:flex-row-reverse" : "sm:flex-row"
              } gap-0 border border-gray-200 rounded-2xl overflow-hidden lg:h-[380px]`}
            >
              {/* Image */}
              <div className="sm:w-[45%] lg:w-[40%] flex-shrink-0">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  width={500}
                  height={400}
                  className="w-full h-64 sm:h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 py-8 px-6 lg:px-10 flex flex-col justify-center gap-4">

                {/* Step number + role */}
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-inter flex-shrink-0 ${step.numBg}`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`text-sm font-semibold uppercase font-inter tracking-wide ${step.roleColor}`}
                  >
                    {step.role}
                  </span>
                </div>

                {/* Title */}
                <h5 className="font-inter font-bold text-xl md:text-2xl lg:text-3xl text-primary leading-snug">
                  {step.title}
                </h5>

                {/* Description */}
                <p className="font-inter text-gray-500 text-base leading-relaxed">
                  {step.description}
                </p>

                {/* Pills */}
                {step.pills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {step.pills.map((pill) => (
                      <span
                        key={pill}
                        className="bg-yellow-50 text-yellow-800 text-sm font-medium font-inter px-4 py-1.5 rounded-full border border-yellow-200"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Connector */}
            {step.connector && (
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-5 bg-green-200" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="w-px h-5 bg-green-200" />
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;