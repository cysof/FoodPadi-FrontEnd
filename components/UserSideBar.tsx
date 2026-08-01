"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  LayoutDashboard,
  Leaf,
  LogOut,
  Package,
  Truck,
  User,
  X,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { setHideSideBar } from "./data/AppSettingSlice";
import { usePathname } from "next/navigation";
import { useLogoutMutation } from "@/features/crops/data/CropApi";

const UserSideBar = () => {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const user = useAppSelector((state) => state.login.user);
  const accountType = user?.account_type?.toUpperCase();

  const expandSidebar = useAppSelector(
    (state) => state.appSetting.expandSidebar
  );
  const hideSideBar = useAppSelector((state) => state.appSetting.hideSideBar);
  const [LogoutMutation] = useLogoutMutation();

  const farmerLinks = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard", exact: true },
    { name: "Marketplace", icon: ShoppingBag, link: "/marketplace", exact: false },
    { name: "My Crops", icon: Leaf, link: "/dashboard/crops", exact: false },
    { name: "Orders", icon: Package, link: "/dashboard/orders", exact: false },
    { name: "Account", icon: User, link: "/dashboard/account", exact: false },
  ];

  const buyerLinks = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard", exact: true },
    { name: "Marketplace", icon: ShoppingBag, link: "/marketplace", exact: false },
    { name: "My Orders", icon: Package, link: "/dashboard/orders", exact: false },
    { name: "Account", icon: User, link: "/dashboard/account", exact: false },
  ];

  const transporterLinks = [
    { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard", exact: true },
    { name: "Marketplace", icon: ShoppingBag, link: "/marketplace", exact: false },
    { name: "Deliveries", icon: Truck, link: "/dashboard/deliveries", exact: false },
    { name: "Account", icon: User, link: "/dashboard/account", exact: false },
  ];

  const links =
    accountType === "FARMER"
      ? farmerLinks
      : accountType === "BUYER"
      ? buyerLinks
      : accountType === "TRANSPORTER"
      ? transporterLinks
      : farmerLinks;

  const closeSidebar = () => dispatch(setHideSideBar(true));

  return (
    <>
      {/* Backdrop — mobile only */}
      {!hideSideBar && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-50 h-dvh bg-white border-r border-gray-200
          flex flex-col transition-all ease-in-out duration-300
          ${hideSideBar
            ? "-translate-x-full md:translate-x-0"
            : "translate-x-0"
          }
          ${expandSidebar || !hideSideBar ? "w-[200px]" : "md:w-[60px] w-[200px]"}
        `}
      >
        {/* Close button — mobile only */}
        <div className="flex items-center justify-between px-3 pt-4 pb-2 md:pt-3">
          <Link href="/" onClick={closeSidebar}>
            <Image
              src="/mainLogo.png"
              className={`shrink-0 transition-all duration-300 ${
                expandSidebar || !hideSideBar ? "w-[120px]" : "md:w-[36px] w-[120px]"
              }`}
              width={120}
              height={40}
              alt="FarmRide Logo"
            />
          </Link>
          <X
            onClick={closeSidebar}
            className="cursor-pointer text-gray-500 hover:text-gray-800 md:hidden"
            width={18}
            height={18}
          />
        </div>

        {/* Nav Links */}
        <ul className="w-full flex flex-col gap-1 pt-4 px-2 flex-1">
          {links.map((link) => {
            const isActive =
              link.exact ? path === link.link : path.startsWith(link.link);
            return (
              <li key={link.name} className="w-full">
                <Link
                  href={link.link}
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 font-inter text-sm font-medium ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-green-50 hover:text-primary"
                  }`}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  <span
                    className={`transition-all duration-300 whitespace-nowrap ${
                      expandSidebar || !hideSideBar
                        ? "flex"
                        : "hidden md:hidden"
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="px-2 pb-6">
          <button
            onClick={() =>
              LogoutMutation()
                .unwrap()
                .then(() => dispatch({ type: "logout" }))
                .catch(() => dispatch({ type: "logout" }))
            }
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 font-inter text-sm font-medium"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                expandSidebar || !hideSideBar ? "flex" : "hidden md:hidden"
              }`}
            >
              Log Out
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSideBar;