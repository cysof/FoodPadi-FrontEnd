"use client";

import React, { ReactNode, useEffect } from "react";
import UserSideBar from "./UserSideBar";
import UserNavbar from "./UserNavbar";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

const UserDashboardWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const logoutLoading = useAppSelector(
    (state) => state.appSetting.logoutLoading
  );
  const token = useAppSelector((state) => state.login.token);

  useEffect(() => {
    if (!(token.access && token.refresh)) {
      router.push("/auth/login");
    }
  }, [token.access, token.refresh]);

  return (
    <div className={`w-full h-dvh flex`}>
      <UserSideBar />
      <div className={`w-full flex flex-col `}>
        <UserNavbar />
        {children}
      </div>
      {logoutLoading && (
        <div
          className={`absolute z-[1000] flex justify-center items-center bg-black opacity-50 top-0 bottom-0 right-0 left-0`}
        >
          <Loader2 className={`animate-spin text-white`} />
        </div>
      )}
    </div>
  );
};

export default UserDashboardWrapper;
