import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div
      className={`bg-[url(/HeaderBg.png)] bg-no-repeat bg-center bg-cover h-dvh w-full`}
    >
      <div
        className={`h-full w-full flex justify-center items-center bg-black/50`}
      >
        <div
          className={`max-w-7xl px-3 w-full mx-auto flex items-center flex-col gap-4`}
        >
          <h1
          data-aos="fade-up" 
          data-aos-delay="200"
            className={`font-square font-bold text-center uppercase text-2xl sm:text-3xl md:text-5xl flex flex-col`}
          >
            <span>Connecting Farmers, Buyers</span>
            <span>and Transporters Seamlessly.</span>
          </h1>
          <p className="text-xl max-w-2xl md:text-2xl text-center font-inter">
            Join the movement to simplify agriculture trading and delivery
            across Nigeria.
          </p>
          <Link
            className={`bg-primary mt-5 hover:bg-primary/90 text-white text-2xl px-7 py-3 rounded-2xl font-square`}
            target='_blank'
            href={`https://chat.whatsapp.com/CuueYeE9cQnJkgYgSLUDHC`}
          >
            Join the Waitlist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
