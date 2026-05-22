// features/account/components/ChangePasswordSection.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useChangePasswordMutation } from "../data/AccountApi";
import { enqueueSnackbar } from "notistack";
import { clearAccountErrors } from "../data/AccountSlice";

const ChangePasswordSection = () => {
  const dispatch = useAppDispatch();

  const changePasswordLoading = useAppSelector(
    (state) => state.account.changePasswordLoading
  );
  const changePasswordError = useAppSelector(
    (state) => state.account.changePasswordError
  );

  const [ChangePasswordMutation] = useChangePasswordMutation();

  const ChangePasswordSchema = yup
    .object({
      old_password: yup
        .string()
        .required("Required")
        .min(8, "Password must be at least 8 characters"),
      new_password: yup
        .string()
        .required("Required")
        .min(8, "Password must be at least 8 characters"),
      confirm_new_password: yup
        .string()
        .required("Required")
        .min(8, "Password must be at least 8 characters")
        .oneOf([yup.ref("new_password")], "Passwords do not match"),
    })
    .required();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IChangePasswordForm>({
    mode: "all",
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  // ✅ Error handling in useEffect
  useEffect(() => {
    if (changePasswordError) {
      enqueueSnackbar(changePasswordError, { variant: "error" });
      dispatch(clearAccountErrors());
    }
  }, [changePasswordError]);

  const onSubmit: SubmitHandler<IChangePasswordForm> = (data) =>
    ChangePasswordMutation({
      old_password: data.old_password,
      new_password: data.new_password,
    })
      .unwrap()
      .then(() => {
        enqueueSnackbar("Password changed successfully!", {
          variant: "success",
        });
        reset();
      });

  return (
    <div className={`flex flex-col gap-5`}>
      <div className={`flex flex-col gap-1`}>
        <h3 className={`font-square font-bold text-2xl text-primary-black`}>
          Change Password
        </h3>
        <p className={`font-inter text-sm text-gray-500`}>
          Update your password here. Make sure it is at least 8 characters.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-4`}
      >
        <div className={`flex flex-col gap-1`}>
          <label className={`font-inter text-sm text-gray-500`}>
            Current Password
          </label>
          <Controller
            name="old_password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                toggleMask
                feedback={false}
                inputClassName={`w-full`}
                className={`w-full`}
              />
            )}
          />
          {errors.old_password && (
            <small className="p-error">{errors.old_password.message}</small>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label className={`font-inter text-sm text-gray-500`}>
            New Password
          </label>
          <Controller
            name="new_password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                toggleMask
                feedback={false}
                inputClassName={`w-full`}
                className={`w-full`}
              />
            )}
          />
          {errors.new_password && (
            <small className="p-error">{errors.new_password.message}</small>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label className={`font-inter text-sm text-gray-500`}>
            Confirm New Password
          </label>
          <Controller
            name="confirm_new_password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                toggleMask
                feedback={false}
                inputClassName={`w-full`}
                className={`w-full`}
              />
            )}
          />
          {errors.confirm_new_password && (
            <small className="p-error">
              {errors.confirm_new_password.message}
            </small>
          )}
        </div>
        <div className={`flex justify-end`}>
          <Button
            type="submit"
            loading={changePasswordLoading}
            className={`primary px-7`}
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordSection;