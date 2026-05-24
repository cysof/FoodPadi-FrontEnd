// features/marketplaceCropId/components/CropId.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Crop from "./Crop";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { clearMarketPlaceCropError } from "../data/MarketCropIDSlice";
import { enqueueSnackbar } from "notistack";
import { useGetOneProductQuery } from "../data/MarketCropIDApi";
import { useEffect } from "react";
import { NotFoundPage } from "@/components";

const CropId = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cropId = useParams<{ cropId: string }>();

  useGetOneProductQuery({ id: +cropId.cropId });

  const getOneProductLoading = useAppSelector(
    (state) => state.marketPlaceCrop.getOneProductLoading
  );
  const getOneProductError = useAppSelector(
    (state) => state.marketPlaceCrop.getOneProductError
  );

  // ✅ Fixed: moved to useEffect
  useEffect(() => {
    if (
      getOneProductError &&
      !getOneProductError.includes("404") &&
      !getOneProductError.includes("Not found")
    ) {
      enqueueSnackbar(getOneProductError, { variant: "error" });
      dispatch(clearMarketPlaceCropError());
    }
  }, [getOneProductError]);

  // ✅ Show 404 page for not found errors
  if (
    getOneProductError &&
    (getOneProductError.includes("404") ||
      getOneProductError.includes("Not found"))
  ) {
    return (
      <NotFoundPage
        title="Crop Not Found"
        message="The crop you are looking for does not exist or has been removed from the marketplace."
      />
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full px-3 md:px-5 lg:px-10 md:py-10 py-5">
      <span
        onClick={() => router.push("/marketplace")}
        className={`h-6 w-6 flex items-center justify-center rounded-full bg-primary cursor-pointer`}
      >
        <ArrowLeft color="white" width={18} />
      </span>
      {getOneProductLoading ? (
        <div className={`w-full h-svh flex items-center justify-center`}>
          <Loader2 className={`animate-spin text-primary duration-300`} />
        </div>
      ) : (
        <Crop />
      )}
    </div>
  );
};

export default CropId;