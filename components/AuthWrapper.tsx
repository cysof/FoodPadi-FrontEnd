import React, { ReactNode } from "react";
import AuthSideBar from "./AuthSideBar";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`bg-secondary flex w-full min-h-dvh`}>
      <AuthSideBar className="lg:sticky lg:top-0 lg:h-dvh lg:shrink-0" />
      <div className={`w-full px-3 py-10 flex items-start justify-center`}>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;