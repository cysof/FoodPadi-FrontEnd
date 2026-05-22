// components/Navbar/MobileDrawer.tsx
"use client";

import { X } from "lucide-react";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ isOpen, onClose }: MobileDrawerProps) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className={`fixed inset-0 bg-black/50 z-[998] md:hidden`}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[999] shadow-xl flex flex-col gap-8 px-6 py-8 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? `translate-x-0` : `-translate-x-full`
        }`}
      >
        {/* Close Button */}
        <div className={`flex justify-end`}>
          <X
            onClick={onClose}
            className={`cursor-pointer text-black hover:text-primary transition-colors duration-200`}
            width={24}
            height={24}
          />
        </div>

        {/* Nav Links */}
        <NavLinks />

        {/* Nav Actions */}
        <NavActions />
      </div>
    </>
  );
};

export default MobileDrawer;