"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import MobileDrawer from "./MobileDrawer";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ConfirmDialog />
      <div
        className={`w-full px-6 sm:px-10 fixed top-0 z-[999] transition-all duration-300 ${
          scrolled
            ? "bg-white border-b border-gray-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/mainLogo.svg"
              width={60}
              height={20}
              alt="Micro FoodBank Logo"
              className={`transition-all duration-300 ${
                scrolled ? "brightness-100" : "brightness-0 invert"
              }`}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex">
            <NavLinks scrolled={scrolled} />
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex">
            <NavActions scrolled={scrolled} />
          </div>

          {/* Mobile Hamburger */}
          <Menu
            onClick={() => setDrawerOpen(true)}
            className={`cursor-pointer flex md:hidden transition-colors duration-300 ${
              scrolled ? "text-black" : "text-white"
            }`}
            width={24}
            height={24}
          />
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