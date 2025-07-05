import { UserDashboardWrapper } from "@/components";
import { OrderId } from "@/features/orderById";
import React from "react";

const page = () => {
  return (
    <UserDashboardWrapper>
      <OrderId />
    </UserDashboardWrapper>
  );
};

export default page;
