import { UserDashboardWrapper } from "@/components";
import { Crops } from "@/features/crops";
import React from "react";

const page = () => {
  return (
    <UserDashboardWrapper>
      <Crops />
    </UserDashboardWrapper>
  );
};

export default page;
