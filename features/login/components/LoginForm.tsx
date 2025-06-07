"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useLoginUserMutation } from "../data/LoginApi";
import { clearLoginError } from "../data/LoginSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loginError = useAppSelector((state) => state.login.loginError);

  const LoginFormSchema = yup
    .object({
      phone_number: yup
        .string()
        .matches(/^(?:\+234|0)[789][01]\d{8}$/, "Invalid phone number")
        .required("required"),
      password: yup
        .string()
        .required("required")
        .min(8, "password must be minimum of 8 character"),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ILoginForm>({
    mode: "all",
    resolver: yupResolver(LoginFormSchema),
    defaultValues: {
      password: "",
      phone_number: "",
    },
  });

  if (loginError) {
    enqueueSnackbar(loginError, { variant: "error" });
    dispatch(clearLoginError());
  }

  const [LoginUserMutation, LoginUser] = useLoginUserMutation();

  const onSubmit: SubmitHandler<ILoginForm> = (data: ILoginForm) =>
    LoginUserMutation(data)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Login successful", { variant: "success" });
        reset();
        router.push("/dashboard");
      });

  return (
    <div
      className={`border border-gray-400 h-max my-auto w-full flex flex-col gap-5 max-w-lg drop-shadow-md rounded-2xl py-10 px-3 md:px-10`}
    >
      <Image
        src={`/logofull.svg`}
        alt="food bank logo"
        width={400}
        height={300}
        className={`w-30 mx-auto`}
      />
      <h4 className={`text-primary-neutral text-center text-md`}>
        Buy, sell, and transport agricultural goods easily.
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full flex flex-col gap-5 mb-5`}
        action=""
      >
        <div className={`flex flex-col gap-1 w-full`}>
          <label className={`text-primary-neutral`}>Phone Number</label>
          <InputText
            {...register("phone_number")}
            className={`w-full p-inputtext-sm`}
          />
          {errors.phone_number && (
            <small className="p-error">{errors.phone_number.message}</small>
          )}
        </div>
        <div className={`flex flex-col gap-1 w-full`}>
          <label className={`text-primary-neutral`}>Password</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                toggleMask={true}
                feedback={false}
                inputClassName={`w-full p-inputtext-sm`}
              />
            )}
          />
          {errors.password && (
            <small className="p-error">{errors.password.message}</small>
          )}
          <Link className={`text-primary self-end`} href={`/auth/register`}>
            Forgot Password?
          </Link>
        </div>
        <Button
          loading={LoginUser.isLoading}
          className={`flex flex-row-reverse gap-2 primary justify-center`}
        >
          Login
        </Button>
      </form>
      <p className={`flex gap-2 items-center text-primary-neutral`}>
        New to Food Bank?{" "}
        <Link className={`text-primary`} href={`/auth/register`}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
