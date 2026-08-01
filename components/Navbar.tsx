import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className={`w-full px-2 sticky top-5 z-[999]`}>
      <div className={`bg-white drop-shadow-sm border border-gray-300 rounded-full max-w-7xl px-5 sm:px-7 py-3 sm:mx-auto text-black`}>
        <div className={`flex justify-between h-full gap-3 items-center w-full`}>
          <Link href={`/`}>
            <Image
              src={`/mainLogo.png`}
              width={60}
              height={20}
              alt="FarmRide Logo"
            />
          </Link>
          <Link
            className={`py-2 px-4 sm:px-7 text-xl bg-primary text-white rounded-full font-square`}
            href={`/marketplace`}
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;