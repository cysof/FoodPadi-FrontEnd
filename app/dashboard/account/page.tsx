// app/dashboard/account/page.tsx
import { UserDashboardWrapper } from "@/components";
import { Account } from "@/features/account";
import React from "react";

const page = () => {
  return (
    <UserDashboardWrapper>
      <Account />
    </UserDashboardWrapper>
  );
};

export default page;