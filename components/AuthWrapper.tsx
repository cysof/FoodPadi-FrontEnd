import React, { ReactNode } from "react";
import AuthSideBar from "./AuthSideBar";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`bg-secondary flex w-full h-dvh overflow-hidden`}>
      <AuthSideBar className="lg:sticky lg:top-0 lg:h-dvh lg:shrink-0" />
      <div className={`overflow-y-auto w-full px-3 py-10 flex items-start justify-center`}>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;