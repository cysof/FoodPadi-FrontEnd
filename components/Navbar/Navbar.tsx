// components/Navbar/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import MobileDrawer from "./MobileDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ConfirmDialog />
      <div className={`w-full px-2 sticky top-5 z-[999]`}>
        <div
          className={`bg-white drop-shadow-sm border border-gray-300 rounded-full max-w-7xl px-5 sm:px-7 py-3 sm:mx-auto text-black`}
        >
          <div className={`flex justify-between h-full gap-3 items-center w-full`}>
            
            {/* Logo */}
            <Link href={`/`}>
              <Image
                src={`/mainLogo.svg`}
                width={60}
                height={20}
                alt="Micro Food Bank Logo"
              />
            </Link>

            {/* Desktop Nav Links - Center */}
            <div className={`hidden md:flex`}>
              <NavLinks />
            </div>

            {/* Desktop Nav Actions - Right */}
            <div className={`hidden md:flex`}>
              <NavActions />
            </div>

            {/* Mobile Hamburger */}
            <Menu
              onClick={() => setDrawerOpen(true)}
              className={`cursor-pointer flex md:hidden text-black`}
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default Navbar;