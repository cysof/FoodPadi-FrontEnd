// components/UserDashboardWrapper.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import UserSideBar from "./UserSideBar";
import UserNavbar from "./UserNavbar";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { setHideSideBar } from "./data/AppSettingSlice";

const UserDashboardWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const logoutLoading = useAppSelector(
    (state) => state.appSetting.logoutLoading
  );
  const token = useAppSelector((state) => state.login.token);
  const hideSideBar = useAppSelector((state) => state.appSetting.hideSideBar);

  useEffect(() => {
    if (!(token.access && token.refresh)) {
      router.push("/auth/login");
    }
  }, [token.access, token.refresh]);

  return (
    <div className={`w-full h-dvh flex overflow-hidden`}>
      <UserSideBar />

      {/* ✅ Mobile backdrop overlay */}
      {!hideSideBar && (
        <div
          onClick={() => dispatch(setHideSideBar(true))}
          className={`fixed inset-0 bg-black/50 z-40 md:hidden`}
        />
      )}

      <div className={`w-full flex flex-col flex-1 min-w-0 overflow-hidden`}>
        <UserNavbar />
        {children}
      </div>

      {/* Logout loading overlay */}
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