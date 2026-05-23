// app/dashboard/deliveries/page.tsx
import { UserDashboardWrapper } from "@/components";
import { Transporter } from "@/features/transporter";
import React from "react";

const page = () => {
  return (
    <UserDashboardWrapper>
      <Transporter />
    </UserDashboardWrapper>
  );
};

export default page;