// app/dashboard/page.tsx
import { UserDashboardWrapper } from "@/components";
import { Dashboard } from "@/features/dashboard";
import React from "react";

const page = () => {
  return (
    <UserDashboardWrapper>
      <Dashboard />
    </UserDashboardWrapper>
  );
};

export default page;