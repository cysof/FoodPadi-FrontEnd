// app/dashboard/deliveries/[deliveryId]/page.tsx
"use client";

import { UserDashboardWrapper } from "@/components";
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
    if (getOneDeliveryError) {
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
        {getOneDeliveryLoading ? (
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