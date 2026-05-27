// app/auth/reset-password/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useConfirmPasswordResetMutation } from "@/features/forgotPassword/data/ForgotPasswordApi";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";

interface IResetPasswordFormInput {
  new_password: string;
  confirm_password: string;
}

const resetPasswordSchema = yup.object({
  new_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmPasswordReset, { isLoading, error }] = useConfirmPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IResetPasswordFormInput>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!token) {
      enqueueSnackbar("Invalid or missing reset token", { variant: "error" });
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.data?.token?.[0] || 
                          (error as any)?.data?.confirm_password?.[0] ||
                          (error as any)?.data?.message || 
                          "Failed to reset password. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }, [error]);

  const onSubmit: SubmitHandler<IResetPasswordFormInput> = async (data) => {
    if (!token) {
      enqueueSnackbar("Invalid reset token", { variant: "error" });
      return;
    }

    try {
      await confirmPasswordReset({
        token,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      }).unwrap();
      
      setIsSuccess(true);
      reset();
      enqueueSnackbar("Password reset successful! Please login with your new password.", { variant: "success" });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  // If no token, show error
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="pi pi-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-primary-black mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or missing.
            Please request a new password reset link.
          </p>
          <Link href="/auth/forgot-password">
            <Button label="Request New Reset Link" className="primary" />
          </Link>
        </div>
      </div>
    );
  }

  // If success, show success message
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="pi pi-check text-green-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-primary-black mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your password has been reset successfully.
            Redirecting you to login page...
          </p>
          <Link href="/auth/login">
            <Button label="Go to Login" className="primary" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-black mb-2">Reset Password</h2>
        <p className="text-gray-600 text-sm">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="new_password" className="font-medium text-primary-black">
            New Password
          </label>
          <InputText
            id="new_password"
            type="password"
            placeholder="Enter new password (min. 8 characters)"
            {...register("new_password")}
            className={`w-full ${errors.new_password ? "p-invalid" : ""}`}
          />
          {errors.new_password && (
            <small className="text-red-500">{errors.new_password.message}</small>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirm_password" className="font-medium text-primary-black">
            Confirm New Password
          </label>
          <InputText
            id="confirm_password"
            type="password"
            placeholder="Confirm your new password"
            {...register("confirm_password")}
            className={`w-full ${errors.confirm_password ? "p-invalid" : ""}`}
          />
          {errors.confirm_password && (
            <small className="text-red-500">{errors.confirm_password.message}</small>
          )}
        </div>

        <Button
          type="submit"
          label={isLoading ? "Resetting..." : "Reset Password"}
          icon="pi pi-key"
          loading={isLoading}
          className="primary w-full"
        />

        <div className="text-center mt-2">
          <Link href="/auth/login" className="text-primary hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;