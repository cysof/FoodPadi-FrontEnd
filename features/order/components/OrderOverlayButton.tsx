"use client";

import { Eye } from "lucide-react";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
// import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
// import { clearCropsError, setShowUpdateCropModal } from "../data/CropSlice";
// import {
//   useDeleteACropMutation,
//   useFlagAvailabilityMutation,
// } from "../data/CropApi";
// import { enqueueSnackbar } from "notistack";
// import { confirmDialog } from "primereact/confirmdialog";
// import { setShowUpdatePostModal } from "../data/DashboardPostSlice";

const OrderOverlayButton = ({ value }: { value: IOrderData }) => {
  const options = useRef<OverlayPanel>(null);
  // const dispatch = useAppDispatch();

  // const deleteCropsError = useAppSelector(
  //   (state) => state.crops.deleteCropsError
  // );
  // const deleteCropsLoading = useAppSelector(
  //   (state) => state.crops.deleteCropsLoading
  // );

  // const [DeleteACropMutation] = useDeleteACropMutation();
  // const [FlagAvailabilityMutation, FlagAvailability] =
  //   useFlagAvailabilityMutation();

  // if (deleteCropsError) {
  //   enqueueSnackbar(deleteCropsError, { variant: "error" });
  //   dispatch(clearCropsError());
  // }

  // const confirm = () => {
  //   confirmDialog({
  //     message: "Are you sure you want to delete this crop?",
  //     header: "Delete Confirmation",
  //     icon: "pi pi-info-circle",
  //     defaultFocus: "reject",
  //     acceptClassName: "p-button-danger",
  //     accept: () =>
  //       DeleteACropMutation({ id: value.id })
  //         .unwrap()
  //         .then(() => options?.current?.hide()),
  //     // reject,
  //   });
  // };

  return (
    <div className="relative text-center">
      <Button
        className={`focus:ring-0 action`}
        icon="pi pi-ellipsis-v"
        onClick={(e) => options?.current?.toggle(e)}
      />

      <OverlayPanel
        ref={options}
        closeOnEscape
        dismissable={true}
        className={` bg-white drop-shadow-md rounded-[10px] text-center max-w-[200px] w-full`}
      >
        <Link
          href={`/dashboard/orders/${value.id}`}
          className={`text-black font-inter font-[600] text-sm hover:bg-[#DDE4E6] hover:cursor-pointer flex items-center gap-2 py-[10px] px-[12px]`}
          // onClick={() => {
          //   dispatch(setShowUpdateCropModal({ id: value.id, show: true }));
          // }}
        >
          <Eye width={20} height={20} /> View Order
        </Link>

        {/* {value.availability.toLowerCase() === "available" ? (
          <a
            className={`text-[#8D1510] font-lato font-[600] text-[14px] hover:bg-[#DDE4E6] hover:cursor-pointer flex items-center gap-2 .justify-center py-[10px] px-[12px]`}
            onClick={() =>
              FlagAvailabilityMutation({
                id: value.id,
                availability: "OUT OF STOCK",
              })
            }
          >
            {FlagAvailability.isLoading ? (
              <Loader2 className={`animate-spin`} width={16} height={16} />
            ) : (
              <XCircle width={16} height={16} />
            )}{" "}
            Out of Stock
          </a>
        ) : (
          value.availability.toLowerCase() === "out of stock" && (
            <a
              className={`text-primary font-lato font-[600] text-[14px] hover:bg-[#DDE4E6] hover:cursor-pointer flex items-center gap-2 .justify-center py-[10px] px-[12px]`}
              onClick={() =>
                FlagAvailabilityMutation({
                  id: value.id,
                  availability: "AVAILABLE",
                })
              }
            >
              {FlagAvailability.isLoading ? (
                <Loader2 className={`animate-spin`} width={16} height={16} />
              ) : (
                <CheckCircle width={16} height={16} />
              )}{" "}
              Available
            </a>
          )
        )}

        <a
          className={`text-[#8D1510] font-inter font-[600] text-[14px] hover:bg-[#DDE4E6] hover:cursor-pointer flex items-center gap-2 .justify-center py-[10px] px-[12px]`}
          onClick={confirm}
        >
          {deleteCropsLoading ? (
            <Loader2 className={`animate-spin`} width={16} height={16} />
          ) : (
            <Trash width={16} height={16} />
          )}
          Delete Crop
        </a> */}
      </OverlayPanel>
    </div>
  );
};

export default OrderOverlayButton;
