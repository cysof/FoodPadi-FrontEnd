import React, { ReactNode } from "react";
import AuthSideBar from "./AuthSideBar";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`bg-secondary flex w-full h-screen overflow-hidden`}>
      <AuthSideBar />
      <div className={`h-dvh px-3 w-full flex justify-center items-center`}>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
