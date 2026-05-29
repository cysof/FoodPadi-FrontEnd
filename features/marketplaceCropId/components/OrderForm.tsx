"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useCreateOrderMutation } from "../data/MarketCropIDApi";
import { enqueueSnackbar } from "notistack";
import { clearMarketPlaceCropError } from "../data/MarketCropIDSlice";

// Local type for form data
interface IOrderFormData {
  crop: number;
  quantity: number;
  delivery_address: string;
  notes: string;
}

const OrderForm = () => {
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) => state.marketPlaceCrop.product);
  const createOrderError = useAppSelector(
    (state) => state.marketPlaceCrop.createOrderError
  );
  const createOrderLoading = useAppSelector(
    (state) => state.marketPlaceCrop.createOrderLoading
  );
  const userId = useAppSelector((state) => state.login.user.id);

  const OrderFormSchema = yup
    .object({
      quantity: yup
        .number()
        .min(1)
        .max(product?.quantity ? product?.quantity : 100)
        .required("Quantity is required"),
      delivery_address: yup.string().required("Delivery address is required"),
      notes: yup.string().default(""),
      crop: yup.number().required("Required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IOrderFormData>({
    mode: "all",
    resolver: yupResolver(OrderFormSchema),
    defaultValues: {
      crop: product?.id,
      delivery_address: "",
      notes: "",
      quantity: 0,
    },
  });

  // Handle errors in useEffect
  useEffect(() => {
    if (createOrderError) {
      enqueueSnackbar(createOrderError, { variant: "error" });
      dispatch(clearMarketPlaceCropError());
    }
  }, [createOrderError, dispatch]);

  const [CreateOrderMutation] = useCreateOrderMutation();

  const onSubmit: SubmitHandler<IOrderFormData> = (data: IOrderFormData) => {
    // Transform to match backend API expectations
    const orderData = {
      crop: data.crop,
      quantity: data.quantity,
      delivery_address: data.delivery_address,
      notes: data.notes,
    };
    
    return CreateOrderMutation(orderData)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Order sent successfully", { variant: "success" });
        reset();
      })
      .catch((error) => {
        console.error("Order creation error:", error);
        enqueueSnackbar(error?.data?.detail || error?.data?.message || "Order not sent", { variant: "error" });
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`w-full flex flex-col gap-7 .max-w-2xl`}
    >
      <div className={`flex flex-col sm:flex-row gap-5 w-full`}>
        <div className={`w-full`}>
          <label
            className={`font-square font-medium text-primary-black`}
            htmlFor="quantity"
          >
            Quantity ({product?.unit})
          </label>
          <InputText
            {...register("quantity")}
            className={`w-full`}
            keyfilter={`int`}
          />
          {errors.quantity && (
            <small className="p-error">{errors.quantity.message}</small>
          )}
        </div>
        <div className={`w-full`}>
          <label
            className={`font-square font-medium text-primary-black`}
            htmlFor="delivery_address"
          >
            Delivery Address
          </label>
          <InputText {...register("delivery_address")} className={`w-full`} />
          {errors.delivery_address && (
            <small className="p-error">{errors.delivery_address.message}</small>
          )}
        </div>
      </div>
      <div className={`flex flex-col gap-1`}>
        <label
          className={`font-square font-medium text-primary-black`}
          htmlFor="notes"
        >
          Special Notes
        </label>
        <InputTextarea
          {...register("notes")}
          className={`resize-none w-full`}
          rows={3}
        />
        {errors.notes && (
          <small className="p-error">{errors.notes.message}</small>
        )}
      </div>

      <div className={`flex flex-col gap-3`}>
        <h3 className={`font-square font-bold text-lg text-primary-black `}>
          Order Summary
        </h3>
        <div className={`flex flex-col gap-3`}>
          <div className={`flex gap-10 items-center`}>
            <div className={`flex flex-col gap-px`}>
              <h5 className={`font-square font-medium text-primary`}>
                Item name
              </h5>
              <p
                className={`font-inter font-normal text-sm text-primary-black`}
              >
                {product?.crop_name}
              </p>
            </div>
            <div className={`flex flex-col gap-px`}>
              <h5 className={`font-square font-medium text-primary`}>
                Quantity
              </h5>
              <p
                className={`font-inter font-normal text-sm text-primary-black`}
              >
                {watch("quantity") ? watch("quantity") : 0}
              </p>
            </div>
          </div>
          <div className={`flex flex-col gap-px`}>
            <h5 className={`font-square font-medium text-primary`}>
              Total Price
            </h5>
            <p className={`font-inter font-normal text-sm text-primary-black`}>
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(
                Number(
                  product?.price_per_unit
                    ? product?.price_per_unit *
                        (watch("quantity") ? watch("quantity") : 0)
                    : 0
                )
              )}
            </p>
          </div>
        </div>
      </div>
      {product?.farmer !== userId && (
        <div className={`flex justify-center`}>
          <Button
            iconPos="right"
            loading={createOrderLoading}
            type="submit"
            className={`primary w-max hover:scale-105 duration-300`}
            label="Place Order"
          />
        </div>
      )}
    </form>
  );
};

export default OrderForm;