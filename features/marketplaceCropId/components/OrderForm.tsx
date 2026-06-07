"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateOrderMutation, useInitializePaymentMutation } from "../data/MarketCropIDApi";
import { enqueueSnackbar } from "notistack";
import { clearMarketPlaceCropError } from "../data/MarketCropIDSlice";

interface IOrderFormData {
  crop: number;
  quantity: number;
  delivery_address: string;
  notes: string;
}

const OrderForm = () => {
  const dispatch = useAppDispatch();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentBreakdown, setPaymentBreakdown] = useState<IPaymentInitResponse['breakdown'] | null>(null);

  const product = useAppSelector((state) => state.marketPlaceCrop.product);
  const createOrderError = useAppSelector((state) => state.marketPlaceCrop.createOrderError);
  const createOrderLoading = useAppSelector((state) => state.marketPlaceCrop.createOrderLoading);
  const userId = useAppSelector((state) => state.login.user.id);

  const OrderFormSchema = yup.object({
    quantity: yup.number().min(1).max(product?.quantity ?? 100).required("Quantity is required"),
    delivery_address: yup.string().required("Delivery address is required"),
    notes: yup.string().default(""),
    crop: yup.number().required("Required"),
  }).required();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<IOrderFormData>({
    mode: "all",
    resolver: yupResolver(OrderFormSchema),
    defaultValues: {
      crop: product?.id,
      delivery_address: "",
      notes: "",
      quantity: 0,
    },
  });

  useEffect(() => {
    if (createOrderError) {
      enqueueSnackbar(createOrderError, { variant: "error" });
      dispatch(clearMarketPlaceCropError());
    }
  }, [createOrderError, dispatch]);

  const [CreateOrderMutation] = useCreateOrderMutation();
  const [initializePayment] = useInitializePaymentMutation();

  const onSubmit: SubmitHandler<IOrderFormData> = async (data) => {
    try {
      // Step 1 — Create order
      const order = await CreateOrderMutation({
        crop: data.crop,
        quantity: data.quantity,
        delivery_address: data.delivery_address,
        notes: data.notes,
      }).unwrap();

      enqueueSnackbar("Order placed! Redirecting to payment...", { variant: "success" });

      // Step 2 — Initialize payment
      const payment = await initializePayment({ order_id: order.id }).unwrap();

      // Step 3 — Show breakdown briefly then redirect
      setPaymentBreakdown(payment.breakdown);
      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = payment.authorization_url;
      }, 2000);

    } catch (error: any) {
      console.error("Error:", error);
      enqueueSnackbar(
        error?.data?.detail || error?.data?.message || "Something went wrong",
        { variant: "error" }
      );
      setIsRedirecting(false);
    }
  };

  // Payment breakdown + redirect screen
  if (isRedirecting && paymentBreakdown) {
    return (
      <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <h3 className="font-square font-bold text-xl text-primary-black">Payment Summary</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="font-inter text-sm text-gray-500">Crop Price</span>
            <span className="font-inter text-sm font-medium">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(paymentBreakdown.crop_price)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-inter text-sm text-gray-500">
              Delivery Fee <span className="text-xs text-gray-400">({paymentBreakdown.delivery_reason})</span>
            </span>
            <span className="font-inter text-sm font-medium">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(paymentBreakdown.delivery_fee)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-1">
            <span className="font-square font-bold text-primary-black">Total</span>
            <span className="font-square font-bold text-primary">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(paymentBreakdown.total)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <i className="pi pi-spin pi-spinner" />
          <span>Redirecting to secure payment...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-7">
      <div className="flex flex-col sm:flex-row gap-5 w-full">
        <div className="w-full">
          <label className="font-square font-medium text-primary-black" htmlFor="quantity">
            Quantity ({product?.unit})
          </label>
          <InputText {...register("quantity")} className="w-full" keyfilter="int" />
          {errors.quantity && <small className="p-error">{errors.quantity.message}</small>}
        </div>
        <div className="w-full">
          <label className="font-square font-medium text-primary-black" htmlFor="delivery_address">
            Delivery Address
          </label>
          <InputText {...register("delivery_address")} className="w-full" />
          {errors.delivery_address && <small className="p-error">{errors.delivery_address.message}</small>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-square font-medium text-primary-black" htmlFor="notes">
          Special Notes
        </label>
        <InputTextarea {...register("notes")} className="resize-none w-full" rows={3} />
        {errors.notes && <small className="p-error">{errors.notes.message}</small>}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-square font-bold text-lg text-primary-black">Order Summary</h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-10 items-center">
            <div className="flex flex-col gap-px">
              <h5 className="font-square font-medium text-primary">Item name</h5>
              <p className="font-inter font-normal text-sm text-primary-black">{product?.crop_name}</p>
            </div>
            <div className="flex flex-col gap-px">
              <h5 className="font-square font-medium text-primary">Quantity</h5>
              <p className="font-inter font-normal text-sm text-primary-black">
                {watch("quantity") ?? 0}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-px">
            <h5 className="font-square font-medium text-primary">Total Price</h5>
            <p className="font-inter font-normal text-sm text-primary-black">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
                Number(product?.price_per_unit ? product.price_per_unit * (watch("quantity") ?? 0) : 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {product?.farmer !== userId && (
        <div className="flex justify-center">
          <Button
            iconPos="right"
            loading={createOrderLoading || isRedirecting}
            type="submit"
            className="primary w-max hover:scale-105 duration-300"
            label={isRedirecting ? "Preparing payment..." : "Place Order & Pay"}
          />
        </div>
      )}
    </form>
  );
};

export default OrderForm;