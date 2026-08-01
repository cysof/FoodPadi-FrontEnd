"use client";

import { X } from "lucide-react";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import Image from "next/image";
import Link from "next/link";

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
          className="fixed inset-0 bg-black/50 z-[998] md:hidden"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[75vw] max-w-[180px] bg-white z-[999] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" onClick={onClose}>
            <Image
              src="/mainLogo.png"
              width={50}
              height={18}
              alt="FarmRide Logo"
            />
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X width={18} height={18} className="text-gray-600" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col px-4 py-4 gap-1 border-b border-gray-100">
          <NavLinks onClose={onClose} />
        </div>

        {/* Nav Actions */}
        <div className="flex flex-col px-4 py-4 gap-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Account
          </p>
          <NavActions scrolled={true} onClose={onClose} />
        </div>

        {/* Footer */}
        <div className="mt-auto px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-inter">
            © {new Date().getFullYear()} FarmRide
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;