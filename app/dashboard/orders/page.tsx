import { UserDashboardWrapper } from "@/components";
import { Order } from "@/features/order";
import React from "react";

const page = () => {
  return (
    <UserDashboardWrapper>
      <Order />
    </UserDashboardWrapper>
  );
};

export default page;
