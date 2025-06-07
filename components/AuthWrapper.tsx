import React, { ReactNode } from "react";
import AuthSideBar from "./AuthSideBar";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`bg-secondary flex w-full h-dvh overflow-hidden`}>
      <AuthSideBar />

      <div
        className={`overflow-y-auto noScroll w-full px-3 py-10 flex justify-center `}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
