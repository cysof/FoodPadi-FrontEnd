// features/account/components/Account.tsx
"use client";

import React, { useState } from "react";
import ProfileSection from "./ProfileSection";
import ChangePasswordSection from "./ChangePasswordSection";

type TabType = "profile" | "password";

const Account = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div
      className={`bg-white overflow-y-scroll pb-10 w-full shrink h-full flex-col flex gap-7 px-3`}
    >
      {/* Header */}
      <div className={`flex flex-col py-5 gap-1`}>
        <h2
          className={`font-square font-bold text-3xl leading-[40px] text-primary-black`}
        >
          Account Settings
        </h2>
        <p className={`font-inter font-normal text-sm text-primary-black`}>
          Manage your profile and account security.
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex border-b border-gray-200`}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`font-inter text-sm font-medium px-5 py-3 transition-colors duration-200 ${
            activeTab === "profile"
              ? `text-primary border-b-2 border-primary`
              : `text-gray-500 hover:text-primary`
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`font-inter text-sm font-medium px-5 py-3 transition-colors duration-200 ${
            activeTab === "password"
              ? `text-primary border-b-2 border-primary`
              : `text-gray-500 hover:text-primary`
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Tab Content */}
      <div className={`max-w-2xl w-full`}>
        {activeTab === "profile" ? (
          <ProfileSection />
        ) : (
          <ChangePasswordSection />
        )}
      </div>
    </div>
  );
};

export default Account;