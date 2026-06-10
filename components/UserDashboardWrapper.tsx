"use client";

import React, { ReactNode, useEffect } from "react";
import UserSideBar from "./UserSideBar";
import UserNavbar from "./UserNavbar";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

const UserDashboardWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const token = useAppSelector((state) => state.login.token);
  const logoutLoading = useAppSelector(
    (state) => state.appSetting.logoutLoading
  );

  useEffect(() => {
    if (!(token.access && token.refresh)) {
      router.push("/auth/login");
    }
  }, [token.access, token.refresh]);

  return (
    <div className="w-full h-dvh flex overflow-hidden bg-white">
      <UserSideBar />
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-white">
        <UserNavbar />
        {children}
      </div>
      {logoutLoading && (
        <div className="absolute inset-0 z-[1000] flex justify-center items-center bg-black/50">
          <Loader2 className="animate-spin text-white" />
        </div>
      )}
    </div>
  );
};

export default UserDashboardWrapper;