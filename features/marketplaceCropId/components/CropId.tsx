"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Crop from "./Crop";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { clearMarketPlaceCropError } from "../data/MarketCropIDSlice";
import { enqueueSnackbar } from "notistack";
import {
  useGetOneProductQuery,
  // useLazyGetOneProductQuery,
} from "../data/MarketCropIDApi";

const CropId = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cropId = useParams<{ cropId: string }>();

  // const loaded = useAppSelector((state) => state.marketPlaceCrop.loaded);

  // const [GetOneProductQuery] = useLazyGetOneProductQuery();

  // if (loaded) {
  // GetOneProductQuery({ id: +cropId.cropId });
  useGetOneProductQuery({ id: +cropId.cropId });
  // }

  const getOneProductLoading = useAppSelector(
    (state) => state.marketPlaceCrop.getOneProductLoading
  );
  const getOneProductError = useAppSelector(
    (state) => state.marketPlaceCrop.getOneProductError
  );

  if (getOneProductError) {
    enqueueSnackbar(getOneProductError, { variant: "error" });
    dispatch(clearMarketPlaceCropError());
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
