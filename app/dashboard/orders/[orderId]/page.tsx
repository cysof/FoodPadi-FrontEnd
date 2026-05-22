// app/dashboard/orders/[orderId]/page.tsx
"use client";

import { UserDashboardWrapper } from "@/components";
import { OrderId } from "@/features/orderById";
import { useAppSelector } from "@/store/hooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetOneOrderQuery } from "@/features/orderById/data/OrderIDApi";
import { useAppDispatch } from "@/store/hooks";
import { clearOrderByIdError } from "@/features/orderById/data/OrderIDSlice";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import OrderPage from "@/features/order/components/BuyerOrderPage";

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
    if (getOneOrderError) {
      enqueueSnackbar(getOneOrderError, { variant: "error" });
      dispatch(clearOrderByIdError());
    }
  }, [getOneOrderError]);

  return (
    <UserDashboardWrapper>
      <div className="flex bg-white flex-col gap-10 w-full px-3 md:px-5 lg:px-10 md:py-10 py-5 overflow-y-auto pb-10 shrink h-full">
        <span
          onClick={() => router.push("/dashboard/orders")}
          className={`h-6 w-6 flex items-center justify-center rounded-full bg-primary cursor-pointer`}
        >
          <ArrowLeft color="white" width={18} />
        </span>
        {getOneOrderLoading ? (
          <div className={`w-full h-svh flex items-center justify-center`}>
            <Loader2 className={`animate-spin text-primary duration-300`} />
          </div>
        ) : accountType === "BUYER" ? (
          <OrderPage />
        ) : (
          <OrderId />
        )}
      </div>
    </UserDashboardWrapper>
  );
};

export default Page;