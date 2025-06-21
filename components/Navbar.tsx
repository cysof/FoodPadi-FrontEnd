import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div
      className={`  w-full px-2 sticky .fixed .right-1/2 .translate-x-1/2 top-5 z-[999] `}
    >
      <div className={`bg-white drop-shadow-sm border border-gray-300 rounded-full max-w-7xl px-5 sm:px-7 py-3 .sm:py-5   sm:mx-auto text-black`}>

      {/* For Web */}
      <div
        className={`flex justify-between h-full gap-3 items-center w-full`}
      >
        <Link href={`/`}>
          <Image
            src={`/mainLogo.svg`}
            width={60}
            height={20}
            alt="Ezer Health care Logo"
          />
        </Link>
        <Link
          className={`.sm:py-3 py-2 px-4 sm:px-7 text-xl bg-primary text-white rounded-full font-square`}
          target='_blank'
          href={`https://chat.whatsapp.com/CuueYeE9cQnJkgYgSLUDHC`}
        >
          Join Waitlist
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
