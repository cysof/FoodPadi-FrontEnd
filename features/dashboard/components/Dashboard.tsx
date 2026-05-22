// features/dashboard/components/Dashboard.tsx
"use client";

import { useAppSelector } from "@/store/hooks";
import FarmerDashboard from "./FarmerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import TransporterDashboard from "./TransporterDashboard";

const Dashboard = () => {
  const user = useAppSelector((state) => state.login.user);

  const accountType = user?.account_type?.toUpperCase();

  const renderDashboard = () => {
    switch (accountType) {
      case "FARMER":
        return <FarmerDashboard />;
      case "BUYER":
        return <BuyerDashboard />;
      case "TRANSPORTER":
        return <TransporterDashboard />;
      default:
        return (
          <div
            className={`w-full h-full flex items-center justify-center`}
          >
            <p className={`font-inter text-sm text-gray-500`}>
              Unknown account type. Please contact support.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white overflow-y-scroll pb-10 w-full shrink h-full flex-col flex gap-7 px-3`}
    >
      <div className={`flex flex-col py-5 gap-1`}>
        <h2
          className={`font-square font-bold text-3xl leading-[40px] text-primary-black`}
        >
          Welcome back, {user?.first_name}! 👋
        </h2>
        <p className={`font-inter font-normal text-sm text-primary-black`}>
          Here is what is happening with your{" "}
          {accountType === "FARMER"
            ? "farm"
            : accountType === "BUYER"
            ? "orders"
            : "deliveries"}{" "}
          today.
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;