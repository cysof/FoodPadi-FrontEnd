"use client";
import Link from "next/link";
import { Carousel } from "primereact/carousel";
import React from "react";

const Header = () => {
  const imgArray = ["/HeaderBg.png", "/HeaderBg2.png"];

  const HeaderTemplate = (val: string) => (
    <div
      style={{
        background: `url(${val})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="h-dvh w-full"
    >
      <div className="h-full w-full flex justify-center items-center bg-black/50 pt-16">
        <div className="max-w-7xl px-4 w-full mx-auto flex items-center flex-col gap-6 text-center">

          {/* Badge */}
          <span className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-medium px-4 py-1.5 rounded-full uppercase tracking-wider">
            🌱 Nigeria's Agri Marketplace
          </span>

          {/* Headline */}
          <h1 className="font-inter text-white font-bold text-center uppercase text-3xl sm:text-4xl md:text-5xl leading-tight">
            <span>Connecting </span>
            <span className="text-yellow-400">Farmers</span>
            <span>, Buyers</span>
            <br />
            <span>& Transporters Seamlessly</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg max-w-xl text-white/85 md:text-xl font-inter">
            Fresh farm produce and livestock — sourced directly from verified
            Nigerian farmers, delivered to your door.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/marketplace"
              className="bg-yellow-400 text-green-900 font-semibold text-sm px-7 py-3 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Browse Marketplace →
            </Link>
            <Link
              href="/about"
              className="text-white border border-white/50 font-medium text-sm px-7 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-4">
            <div className="text-center">
              <p className="text-yellow-400 text-2xl font-bold">500+</p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">Farmers</p>
            </div>
            <div className="w-px bg-white/15 self-stretch" />
            <div className="text-center">
              <p className="text-yellow-400 text-2xl font-bold">1,200+</p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">Products</p>
            </div>
            <div className="w-px bg-white/15 self-stretch" />
            <div className="text-center">
              <p className="text-yellow-400 text-2xl font-bold">36</p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">States</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <Carousel
      showNavigators={false}
      showIndicators={true}
      value={imgArray}
      numVisible={1}
      numScroll={1}
      circular
      autoplayInterval={7000}
      itemTemplate={HeaderTemplate}
    />
  );
};

export default Header;