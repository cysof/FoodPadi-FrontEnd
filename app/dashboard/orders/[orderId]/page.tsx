// app/dashboard/orders/[orderId]/page.tsx
"use client";

import { UserDashboardWrapper } from "@/components";
import { NotFoundState } from "@/components";
import { clearOrderByIdError } from "@/features/orderById/data/OrderIDSlice";
import { useGetOneOrderQuery } from "@/features/orderById/data/OrderIDApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import OrderPage from "@/features/orderById/components/OrderPage";
import BuyerOrderPage from "@/features/order/components/BuyerOrderPage";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = useParams<{ orderId: string }>();
  const user = useAppSelector((state) => state.login.user);
  const accountType = user?.account_type?.toUpperCase();

  useGetOneOrderQuery({ id: +orderId.orderId });

  const getOneOrderLoading = useAppSelector(
    (state) => state.orderById.getOneOrderLoading
  );
  const getOneOrderError = useAppSelector(
    (state) => state.orderById.getOneOrderError
  );

  useEffect(() => {
    if (
      getOneOrderError &&
      !getOneOrderError.includes("404") &&
      !getOneOrderError.includes("Not found")
    ) {
      enqueueSnackbar(getOneOrderError, { variant: "error" });
      dispatch(clearOrderByIdError());
    }
  }, [getOneOrderError]);

  return (
    <UserDashboardWrapper>
      <div
        className={`flex bg-white flex-col gap-10 w-full px-3 md:px-5 lg:px-10 md:py-10 py-5 overflow-y-auto pb-10 shrink h-full`}
      >
        <span
          onClick={() => router.push("/dashboard/orders")}
          className={`h-6 w-6 flex items-center justify-center rounded-full bg-primary cursor-pointer`}
        >
          <ArrowLeft color="white" width={18} />
        </span>

        {/* 404 State */}
        {getOneOrderError &&
        (getOneOrderError.includes("404") ||
          getOneOrderError.includes("Not found")) ? (
          <NotFoundState
            title="Order Not Found"
            message="The order you are looking for does not exist or you do not have permission to view it."
            backPath="/dashboard/orders"
            backLabel="Back to Orders"
          />
        ) : getOneOrderLoading ? (
          <div className={`w-full h-svh flex items-center justify-center`}>
            <Loader2 className={`animate-spin text-primary duration-300`} />
          </div>
        ) : accountType === "BUYER" ? (
          <BuyerOrderPage />
        ) : (
          <OrderPage />
        )}
      </div>
    </UserDashboardWrapper>
  );
};

export default Page;