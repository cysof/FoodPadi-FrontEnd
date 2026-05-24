// app/dashboard/deliveries/[deliveryId]/page.tsx
"use client";

import { UserDashboardWrapper } from "@/components";
import { NotFoundState } from "@/components";
import { DeliveryDetail } from "@/features/transporter";
import { clearTransporterErrors } from "@/features/transporter/data/TransporterSlice";
import { useGetOneDeliveryQuery } from "@/features/transporter/data/TransporterApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deliveryId = useParams<{ deliveryId: string }>();

  useGetOneDeliveryQuery({ id: +deliveryId.deliveryId });

  const getOneDeliveryLoading = useAppSelector(
    (state) => state.transporter.getOneDeliveryLoading
  );
  const getOneDeliveryError = useAppSelector(
    (state) => state.transporter.getOneDeliveryError
  );

  useEffect(() => {
    if (
      getOneDeliveryError &&
      !getOneDeliveryError.includes("404") &&
      !getOneDeliveryError.includes("Not found")
    ) {
      enqueueSnackbar(getOneDeliveryError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [getOneDeliveryError]);

  return (
    <UserDashboardWrapper>
      <div
        className={`flex bg-white flex-col gap-10 w-full px-3 md:px-5 lg:px-10 md:py-10 py-5 overflow-y-auto pb-10 shrink h-full`}
      >
        <span
          onClick={() => router.push("/dashboard/deliveries")}
          className={`h-6 w-6 flex items-center justify-center rounded-full bg-primary cursor-pointer`}
        >
          <ArrowLeft color="white" width={18} />
        </span>

        {/* 404 State */}
        {getOneDeliveryError &&
        (getOneDeliveryError.includes("404") ||
          getOneDeliveryError.includes("Not found")) ? (
          <NotFoundState
            title="Delivery Not Found"
            message="The delivery you are looking for does not exist or you do not have permission to view it."
            backPath="/dashboard/deliveries"
            backLabel="Back to Deliveries"
          />
        ) : getOneDeliveryLoading ? (
          <div className={`w-full h-svh flex items-center justify-center`}>
            <Loader2 className={`animate-spin text-primary duration-300`} />
          </div>
        ) : (
          <DeliveryDetail />
        )}
      </div>
    </UserDashboardWrapper>
  );
};

export default Page;