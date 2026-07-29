// features/forgotPassword/components/ForgotPasswordForm.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPasswordMutation } from "../data/ForgotPasswordApi";

interface IForgotPasswordForm {
  email: string;
}

const ForgotPasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [ForgotPasswordMutation, ForgotPassword] = useForgotPasswordMutation();

  const ForgotPasswordSchema = yup
    .object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordForm>({
    mode: "all",
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<IForgotPasswordForm> = (data) =>
    ForgotPasswordMutation(data)
      .unwrap()
      .then(() => {
        setSubmitted(true);
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong. Please try again.", {
          variant: "error",
        });
      });

  return (
    <div
      className={`border bg-secondary border-gray-400 h-max my-auto w-full flex flex-col gap-5 max-w-lg drop-shadow-md rounded-2xl py-10 px-3 md:px-10`}
    >
      <Image
        src={`/mainLogo.png`}
        alt="food bank logo"
        width={400}
        height={300}
        className={`w-30 mx-auto`}
      />

      {submitted ? (
        // ✅ Success state
        <div className={`flex flex-col items-center gap-4 text-center`}>
          <div
            className={`h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center`}
          >
            <i className={`pi pi-envelope text-primary text-2xl`} />
          </div>
          <h3 className={`font-square font-bold text-xl text-primary-black`}>
            Check Your Email
          </h3>
          <p className={`font-inter text-sm text-gray-500`}>
            If an account with that email exists, we have sent a password reset
            link. Please check your inbox and spam folder.
          </p>
          <Link
            href={`/auth/login`}
            className={`text-primary font-inter text-sm`}
          >
            Back to Login
          </Link>
        </div>
      ) : (
        // ✅ Form state
        <>
          <div className={`flex flex-col gap-1 text-center`}>
            <h3
              className={`font-square font-bold text-xl text-primary-black`}
            >
              Forgot Password?
            </h3>
            <p className={`font-inter text-sm text-primary-neutral`}>
              Enter your email address and we will send you a reset link.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`w-full flex flex-col gap-5`}
          >
            <div className={`flex flex-col gap-1 w-full`}>
              <label className={`text-primary-neutral`}>Email Address</label>
              <InputText
                {...register("email")}
                className={`w-full p-inputtext-sm`}
                placeholder="Enter your email"
                type="email"
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>
            <Button
              loading={ForgotPassword.isLoading}
              type="submit"
              className={`flex flex-row-reverse gap-2 primary justify-center`}
            >
              Send Reset Link
            </Button>
          </form>
          <p className={`flex gap-2 items-center text-primary-neutral`}>
            Remember your password?{" "}
            <Link className={`text-primary`} href={`/auth/login`}>
              Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;