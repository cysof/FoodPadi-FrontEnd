"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateOrderMutation, useInitializePaymentMutation } from "../data/MarketCropIDApi";
import { enqueueSnackbar } from "notistack";
import { clearMarketPlaceCropError } from "../data/MarketCropIDSlice";
import { Loader2 } from "lucide-react";

interface IOrderFormData {
  crop: number;
  quantity: number;
  delivery_address: string;
  notes: string;
}

const OrderForm = () => {
  const dispatch = useAppDispatch();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentBreakdown, setPaymentBreakdown] = useState<IPaymentInitResponse["breakdown"] | null>(null);

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

  const { register, handleSubmit, watch, formState: { errors } } = useForm<IOrderFormData>({
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

  const quantity = watch("quantity") ?? 0;
  const totalPrice = Number(product?.price_per_unit || 0) * Number(quantity);

  const onSubmit: SubmitHandler<IOrderFormData> = async (data) => {
    try {
      const order = await CreateOrderMutation({
        crop: data.crop,
        quantity: data.quantity,
        delivery_address: data.delivery_address,
        notes: data.notes,
      }).unwrap();

      enqueueSnackbar("Order placed! Redirecting to payment...", { variant: "success" });

      const payment = await initializePayment({ order_id: order.id }).unwrap();
      setPaymentBreakdown(payment.breakdown);
      setIsRedirecting(true);

      setTimeout(() => {
        window.location.href = payment.authorization_url;
      }, 2000);
    } catch (error: any) {
      enqueueSnackbar(
        error?.data?.detail || error?.data?.message || "Something went wrong",
        { variant: "error" }
      );
      setIsRedirecting(false);
    }
  };

  // Payment redirect screen
  if (isRedirecting && paymentBreakdown) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-inter font-bold text-lg text-gray-900">Payment Summary</h3>
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between font-inter text-sm">
            <span className="text-gray-500">Crop Price</span>
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(paymentBreakdown.crop_price)}
            </span>
          </div>
          <div className="flex justify-between font-inter text-sm">
            <span className="text-gray-500">
              Delivery Fee
              <span className="text-xs text-gray-400 ml-1">({paymentBreakdown.delivery_reason})</span>
            </span>
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(paymentBreakdown.delivery_fee)}
            </span>
          </div>
          <div className="flex justify-between font-inter text-sm border-t border-gray-200 pt-3 mt-1">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-green-700">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(paymentBreakdown.total)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
          <Loader2 size={14} className="animate-spin" />
          <span>Redirecting to secure payment...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* Quantity + Delivery Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-sm font-medium text-gray-700">
            Quantity ({product?.unit})
          </label>
          <input
            {...register("quantity")}
            type="number"
            min="1"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors"
          />
          {errors.quantity && (
            <small className="text-red-500 text-xs font-inter">{errors.quantity.message}</small>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-inter text-sm font-medium text-gray-700">
            Delivery Address
          </label>
          <input
            {...register("delivery_address")}
            type="text"
            placeholder="Enter your delivery address"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors"
          />
          {errors.delivery_address && (
            <small className="text-red-500 text-xs font-inter">{errors.delivery_address.message}</small>
          )}
        </div>
      </div>

      {/* Special Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="font-inter text-sm font-medium text-gray-700">
          Special Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Any special instructions for the farmer or delivery..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors resize-none"
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-2.5">
        <p className="font-inter text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Order Summary
        </p>
        <div className="flex justify-between font-inter text-sm">
          <span className="text-gray-500">Product</span>
          <span className="text-gray-900 font-medium capitalize">{product?.crop_name}</span>
        </div>
        <div className="flex justify-between font-inter text-sm">
          <span className="text-gray-500">Quantity</span>
          <span className="text-gray-900 font-medium">{quantity} {product?.unit}</span>
        </div>
        <div className="flex justify-between font-inter text-sm">
          <span className="text-gray-500">Price per unit</span>
          <span className="text-gray-900 font-medium">
            {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
              Number(product?.price_per_unit || 0)
            )}
          </span>
        </div>
        <div className="flex justify-between font-inter text-sm border-t border-gray-200 pt-2.5 mt-1">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-green-700">
            {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(totalPrice)}
          </span>
        </div>
      </div>

      {/* Submit button */}
     {product?.farmer === userId ? (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
    <p className="font-inter text-sm text-yellow-800 font-medium">
      This is your listing — you cannot order your own product.
    </p>
  </div>
) : (
  <button
    type="submit"
    disabled={createOrderLoading || isRedirecting}
    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 disabled:text-gray-400 text-green-900 font-inter font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
  >
    {createOrderLoading || isRedirecting ? (
      <>
        <Loader2 size={16} className="animate-spin" />
        {isRedirecting ? "Preparing payment..." : "Placing order..."}
      </>
    ) : (
      "Place Order & Pay →"
    )}
  </button>
)}
    </form>
  );
};

export default OrderForm;