"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  LayoutDashboard,
  Leaf,
  LogOut,
  Package,
  ShoppingCart,
  User,
  X,
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

  const expandSidebar = useAppSelector(
    (state) => state.appSetting.expandSidebar
  );
  const hideSideBar = useAppSelector((state) => state.appSetting.hideSideBar);

  const [LogoutMutation] = useLogoutMutation();

  const links = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      link: "/dashboard",
    },
    {
      name: "My Crops",
      icon: Leaf,
      link: "/dashboard/crops",
    },
    {
      name: "Market",
      icon: ShoppingCart,
      link: "/dashboard/market",
    },
    {
      name: "Orders",
      icon: Package,
      link: "/dashboard/orders",
    },
    {
      name: "Account",
      icon: User,
      link: "/dashboard/account",
    },
  ];

  return (
    <div
      className={` ${
        hideSideBar
          ? `-translate-x-full absolute md:relative z-50 md:translate-x-0`
          : `translate-0 drop-shadow-lg md:drop-shadow-none md:relative absolute z-50`
      } delay-200  overflow-hidden  h-dvh w-max .max-w-[150px] bg-secondary py-4 transition-all ease-in-out duration-300 text-black  .w-full .max-w-40 `}
    >
      {!hideSideBar && (
        <X
          onClick={() => dispatch(setHideSideBar(true))}
          className={`cursor-pointer absolute top-2 right-2 text-black md:hidden flex`}
        />
      )}
      {expandSidebar || !hideSideBar ? (
        <Image
          src={`/mainLogo.svg`}
          className={`shrink-0 px-2 pt-5 md:pt-0`}
          width={150}
          height={150}
          alt="logo"
        />
      ) : (
        <Image
          src={`/mainLogo.svg`}
          className={`shrink-0 px-3 pt-5 md:pt-0`}
          width={50}
          height={50}
          alt="logo"
        />
      )}
      <ul className={`w-full pt-5`}>
        {links.map((link) => (
          <li key={link.name} className={`w-full`}>
            <Link
              className={`w-full flex .shrink-0 items-center gap-3 px-3 py-2 ${
                path === link.link && `bg-primary text-secondary`
              } hover:bg-primary hover:text-secondary`}
              href={link.link}
            >
              <link.icon className={`h-5 w-5 shrink-0`} />
              <span
                className={`transition-all duration-300 ease-in-out ${
                  expandSidebar
                    ? `flex`
                    : ` ${!hideSideBar ? `flex` : `hidden`}`
                }`}
              >
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`#`}
        onClick={() =>
          LogoutMutation()
            .unwrap()
            .then(() => dispatch({ type: "logout" }))
            .catch(() => dispatch({ type: "logout" }))
        }
        className={`font-[400] absolute bottom-10 text-[16px] mx-auto text-[#9A0000] flex gap-2 items-center cursor-pointer font-lato text-center px-5 py-3`}
      >
        <LogOut width={18} height={18} />{" "}
        <span
          className={`transition-all duration-300 ease-in-out ${
            expandSidebar ? `flex` : ` ${!hideSideBar ? `flex` : `hidden`}`
          }`}
        >
          Log Out
        </span>
      </Link>
    </div>
  );
};

export default UserSideBar;
