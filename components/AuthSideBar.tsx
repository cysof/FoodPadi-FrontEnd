"use client";

import Image from "next/image";
import { Timeline } from "primereact/timeline";
import React from "react";

const AuthSideBar = () => {
  const events: timelineData[] = [
    {
      status: "Sellers",
      icon: "pi pi-shopping-cart text-white",
      color: "#4caf50",
      decription:
        "Reach a wide market for your farm produce. List your goods, set your price, and connect with ready buyers across the country.",
    },
    {
      status: "Buyers",
      icon: "pi pi-cog text-white",
      color: "#4caf50",
      decription:
        "Discover fresh, quality agricultural products from trusted local sellers. Order and receive your goods right at your doorstep.",
    },
    {
      status: "Transporters",
      icon: "pi pi-truck text-white",
      color: "#4caf50",
      decription:
        "Join as a registered transporter and earn by helping farmers and buyers move goods safely and quickly.",
    },
  ];

  const customizedMarker = (item: timelineData) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{ backgroundColor: item.color }}
      >
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item: timelineData) => {
    return (
      <div className={`bg-secondary text-black px-4 py-4 rounded-md`}>
        <h4 className={`font-bold`}>{item.status}</h4>
        <p>{item.decription}</p>
      </div>
    );
  };
  return (
    <div
      className={`w-full max-w-lg gap-4 py-5 hidden lg:flex bg-primary flex-col items-center justify-center`}
    >
      <div className={`rounded-2xl bg-white flex items-center justify-center h-max w-max`}>

      <Image
        src={`/mainLogo.svg`}
        width={400}
        height={300}
        alt="Food Bank Logo"
        className={`w-50`}
      />
      </div>
      <div>
        <Timeline
          value={events}
          align="alternate"
          className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
        />
      </div>
    </div>
  );
};

export default AuthSideBar;
