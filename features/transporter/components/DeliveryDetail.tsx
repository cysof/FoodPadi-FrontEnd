// features/transporter/components/DeliveryDetail.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { enqueueSnackbar } from "notistack";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import React, { useEffect, useRef, useState } from "react";
import {
  useAcceptDeliveryMutation,
  useStartDeliveryMutation,
  useCompleteDeliveryMutation,
  useCancelDeliveryMutation,
  useRejectDeliveryMutation,
} from "../data/TransporterApi";
import { clearTransporterErrors } from "../data/TransporterSlice";
import { MapPin, Calendar, Package, User2 } from "lucide-react";
import Image from "next/image";

// Helper function to get full Cloudinary URL
const getFullImageUrl = (imgPath: string | null | undefined) => {
  if (!imgPath) return null;
  
  // If it's already a full URL, return as is
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  
  // If it's a Cloudinary path, construct the full URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name-here';
  return `https://res.cloudinary.com/${cloudName}/${imgPath}`;
};

const DeliveryStatusBadge = ({ status }: { status: string }) => {
  const color =
    status === "PENDING"
      ? "bg-yellow-400"
      : status === "ACCEPTED"
      ? "bg-blue-400"
      : status === "ON_THE_WAY"
      ? "bg-sky-500"
      : status === "DELIVERED"
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <span className={`text-xs text-white px-3 py-1 rounded-full ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const DeliveryTimeline = ({ delivery }: { delivery: ITransporterDelivery }) => {
  const steps = [
    {
      label: "Delivery Accepted",
      time: delivery.accepted_at,
      done: !!delivery.accepted_at,
    },
    {
      label: "On The Way",
      time: delivery.on_the_way_at,
      done: !!delivery.on_the_way_at,
    },
    {
      label: "Delivered",
      time: delivery.delivered_at,
      done: !!delivery.delivered_at,
    },
  ];

  return (
    <div className={`flex flex-col gap-3`}>
      {steps.map((step, index) => (
        <div key={index} className={`flex items-center gap-3`}>
          <div
            className={`h-4 w-4 rounded-full shrink-0 ${
              step.done ? `bg-primary` : `bg-gray-300`
            }`}
          />
          <div className={`flex flex-col`}>
            <span
              className={`font-inter text-sm font-medium ${
                step.done ? `text-primary` : `text-gray-400`
              }`}
            >
              {step.label}
            </span>
            {step.time && (
              <span className={`font-inter text-xs text-gray-400`}>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(step.time))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const DeliveryDetail = () => {
  const dispatch = useAppDispatch();
  const cancelReasonRef = useRef<string>("");
  const [proofImage, setProofImage] = useState<File | null>(null);

  const delivery = useAppSelector(
    (state) => state.transporter.selectedDelivery
  );

  const acceptDeliveryError = useAppSelector(
    (state) => state.transporter.acceptDeliveryError
  );
  const startDeliveryError = useAppSelector(
    (state) => state.transporter.startDeliveryError
  );
  const completeDeliveryError = useAppSelector(
    (state) => state.transporter.completeDeliveryError
  );
  const cancelDeliveryError = useAppSelector(
    (state) => state.transporter.cancelDeliveryError
  );
  const rejectDeliveryError = useAppSelector(
    (state) => state.transporter.rejectDeliveryError
  );

  const acceptDeliveryLoading = useAppSelector(
    (state) => state.transporter.acceptDeliveryLoading
  );
  const startDeliveryLoading = useAppSelector(
    (state) => state.transporter.startDeliveryLoading
  );
  const completeDeliveryLoading = useAppSelector(
    (state) => state.transporter.completeDeliveryLoading
  );
  const cancelDeliveryLoading = useAppSelector(
    (state) => state.transporter.cancelDeliveryLoading
  );
  const rejectDeliveryLoading = useAppSelector(
    (state) => state.transporter.rejectDeliveryLoading
  );

  const [AcceptDeliveryMutation] = useAcceptDeliveryMutation();
  const [StartDeliveryMutation] = useStartDeliveryMutation();
  const [CompleteDeliveryMutation] = useCompleteDeliveryMutation();
  const [CancelDeliveryMutation] = useCancelDeliveryMutation();
  const [RejectDeliveryMutation] = useRejectDeliveryMutation();

  useEffect(() => {
    if (acceptDeliveryError) {
      enqueueSnackbar(acceptDeliveryError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [acceptDeliveryError]);

  useEffect(() => {
    if (startDeliveryError) {
      enqueueSnackbar(startDeliveryError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [startDeliveryError]);

  useEffect(() => {
    if (completeDeliveryError) {
      enqueueSnackbar(completeDeliveryError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [completeDeliveryError]);

  useEffect(() => {
    if (cancelDeliveryError) {
      enqueueSnackbar(cancelDeliveryError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [cancelDeliveryError]);

  useEffect(() => {
    if (rejectDeliveryError) {
      enqueueSnackbar(rejectDeliveryError, { variant: "error" });
      dispatch(clearTransporterErrors());
    }
  }, [rejectDeliveryError]);

  const handleAccept = () => {
    confirmDialog({
      message: `Are you sure you want to accept this delivery for ${delivery?.crop_name}?`,
      header: "Accept Delivery",
      icon: "pi pi-check-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept: () =>
        AcceptDeliveryMutation({ id: Number(delivery?.id) })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Delivery accepted successfully!", {
              variant: "success",
            })
          )
          .catch(() => {}),
    });
  };

  const handleStart = () => {
    confirmDialog({
      message: `Are you sure you want to start this delivery?`,
      header: "Start Delivery",
      icon: "pi pi-truck",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept: () =>
        StartDeliveryMutation({ id: Number(delivery?.id) })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Delivery started! You are on the way.", {
              variant: "success",
            })
          )
          .catch(() => {}),
    });
  };

  const handleComplete = () => {
    const formData = new FormData();
    if (proofImage) {
      formData.append("proof_of_delivery_image", proofImage);
    }
    confirmDialog({
      message: `Are you sure you want to mark this delivery as completed?`,
      header: "Complete Delivery",
      icon: "pi pi-check",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept: () =>
        CompleteDeliveryMutation({
          id: Number(delivery?.id),
          formData,
        })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Delivery completed successfully!", {
              variant: "success",
            })
          )
          .catch(() => {}),
    });
  };

  const handleCancel = () => {
    cancelReasonRef.current = "";
    confirmDialog({
      message: (
        <div className={`flex flex-col gap-3`}>
          <p className={`font-inter text-sm text-gray-600`}>
            Please provide a reason for cancelling this delivery.
          </p>
          <InputTextarea
            autoFocus
            className={`resize-none w-full`}
            rows={3}
            placeholder="Enter cancellation reason..."
            onChange={(e) => {
              cancelReasonRef.current = e.target.value;
            }}
          />
        </div>
      ),
      header: "Cancel Delivery",
      icon: "pi pi-times-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, Cancel",
      rejectLabel: "Go Back",
      accept: () => {
        if (!cancelReasonRef.current.trim()) {
          enqueueSnackbar("Please provide a cancellation reason.", {
            variant: "warning",
          });
          return;
        }
        CancelDeliveryMutation({
          id: Number(delivery?.id),
          reason: cancelReasonRef.current,
        })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Delivery cancelled successfully.", {
              variant: "success",
            })
          )
          .catch(() => {});
      },
    });
  };

  const handleReject = () => {
    confirmDialog({
      message: `Are you sure you want to reject this delivery? It will be reassigned to another transporter.`,
      header: "Reject Delivery",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, Reject",
      rejectLabel: "Go Back",
      accept: () =>
        RejectDeliveryMutation({ id: Number(delivery?.id) })
          .unwrap()
          .then(() =>
            enqueueSnackbar("Delivery rejected and reassigned.", {
              variant: "info",
            })
          )
          .catch(() => {}),
    });
  };

  // Get full Cloudinary URL for proof of delivery image
  const proofImageUrl = getFullImageUrl(delivery?.proof_of_delivery_image);

  return (
    <div className={`flex flex-col gap-8`}>
      <ConfirmDialog />

      {/* Header */}
      <div className={`flex items-center justify-between`}>
        <h3 className={`font-square font-bold text-3xl text-primary-black`}>
          Delivery #{delivery?.id}
        </h3>
        {delivery && (
          <DeliveryStatusBadge status={delivery.delivery_status} />
        )}
      </div>

      {/* Delivery Info */}
      <div className={`flex flex-col gap-2`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          Delivery Information
        </h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Crop
            </h5>
            <div className={`flex items-center gap-2`}>
              <Package width={16} className={`text-primary`} />
              <p className={`font-inter text-sm text-primary-black capitalize`}>
                {delivery?.crop_name}
              </p>
            </div>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Buyer
            </h5>
            <div className={`flex items-center gap-2`}>
              <User2 width={16} className={`text-primary`} />
              <p className={`font-inter text-sm text-primary-black`}>
                {delivery?.buyer_name}
              </p>
            </div>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Delivery Address
            </h5>
            <div className={`flex items-center gap-2`}>
              <MapPin width={16} className={`text-primary`} />
              <p className={`font-inter text-sm text-primary-black`}>
                {delivery?.delivery_address}
              </p>
            </div>
          </div>
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-primary`}>
              Delivery Date
            </h5>
            <div className={`flex items-center gap-2`}>
              <Calendar width={16} className={`text-primary`} />
              <p className={`font-inter text-sm text-primary-black`}>
                {delivery?.delivery_date &&
                  new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(delivery.delivery_date))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Timeline */}
      {delivery && (
        <div className={`flex flex-col gap-3`}>
          <h3 className={`font-square font-bold text-xl text-primary-black`}>
            Delivery Timeline
          </h3>
          <DeliveryTimeline delivery={delivery} />
        </div>
      )}

      {/* Proof of Delivery Upload - Only show when ON_THE_WAY */}
      {delivery?.delivery_status === "ON_THE_WAY" && (
        <div className={`flex flex-col gap-3`}>
          <h3 className={`font-square font-bold text-xl text-primary-black`}>
            Proof of Delivery
          </h3>
          <p className={`font-inter text-sm text-gray-500`}>
            Upload a photo as proof of delivery (optional but recommended).
          </p>
          <FileUpload
            customUpload
            accept="image/*"
            maxFileSize={5000000}
            onSelect={(e) => setProofImage(e.files[0])}
            emptyTemplate={
              <p className="m-0">Drag and drop an image here to upload.</p>
            }
          />
        </div>
      )}

      {/* Proof of Delivery Image - Show when delivered */}
      {proofImageUrl && (
        <div className={`flex flex-col gap-2`}>
          <h5 className={`font-square font-medium text-lg text-primary`}>
            Proof of Delivery
          </h5>
          <Image
            src={proofImageUrl}
            alt="Proof of delivery"
            width={300}
            height={200}
            className={`rounded-2xl object-cover`}
          />
        </div>
      )}

      {/* Cancel Reason */}
      {delivery?.delivery_status === "CANCELLED" &&
        delivery?.cancel_reason && (
          <div className={`flex flex-col gap-1`}>
            <h5 className={`font-square font-medium text-lg text-red-600`}>
              Cancellation Reason
            </h5>
            <p className={`font-inter font-normal text-sm text-red-500`}>
              {delivery.cancel_reason}
            </p>
          </div>
        )}

      {/* Action Buttons */}
      <div
        className={`flex flex-col sm:flex-row gap-3 flex-wrap mt-5`}
      >
        {/* PENDING actions */}
        {delivery?.delivery_status === "PENDING" && (
          <>
            <Button
              className={`primary justify-center`}
              label="Accept Delivery"
              loading={acceptDeliveryLoading}
              onClick={handleAccept}
            />
            <Button
              outlined
              severity="danger"
              className={`justify-center`}
              label="Reject Delivery"
              loading={rejectDeliveryLoading}
              onClick={handleReject}
            />
          </>
        )}

        {/* ACCEPTED actions */}
        {delivery?.delivery_status === "ACCEPTED" && (
          <>
            <Button
              className={`primary justify-center`}
              label="Start Delivery"
              loading={startDeliveryLoading}
              onClick={handleStart}
            />
            <Button
              outlined
              severity="danger"
              className={`justify-center`}
              label="Cancel Delivery"
              loading={cancelDeliveryLoading}
              onClick={handleCancel}
            />
          </>
        )}

        {/* ON_THE_WAY actions */}
        {delivery?.delivery_status === "ON_THE_WAY" && (
          <Button
            className={`primary justify-center`}
            label="Mark as Delivered"
            loading={completeDeliveryLoading}
            onClick={handleComplete}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryDetail;