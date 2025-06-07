"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ArrowLeft, Menu } from "lucide-react";
import Image from "next/image";
import React from "react";
import { setExpandSide, setHideSideBar } from "./data/AppSettingSlice";

const UserNavbar = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.login.user);
  const expandSidebar = useAppSelector(
    (state) => state.appSetting.expandSidebar
  );

  return (
    <div
      className={`bg-secondary text-black w-full py-3 px-4 flex justify-between`}
    >
      <Menu
        onClick={() => dispatch(setHideSideBar(false))}
        className={`cursor-pointer flex md:hidden `}
      />
      {!expandSidebar ? (
        <Menu
          onClick={() => dispatch(setExpandSide(true))}
          className={`cursor-pointer hidden md:flex `}
        />
      ) : (
        <ArrowLeft
          onClick={() => dispatch(setExpandSide(false))}
          className={`cursor-pointer hidden md:flex `}
        />
      )}
      {/* <Menu /> */}
      {/* </div> */}
      <div className={`flex items-center gap-2`}>
        <Image
          src={`/profile.png`}
          alt="Profile pics"
          width={30}
          height={30}
          className={`rounded-full bg-secondary`}
        />
        <span className={`hidden md:flex`}>{user?.first_name}</span>
      </div>
    </div>
  );
};

export default UserNavbar;
