"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useLoginUserMutation } from "../data/LoginApi";
import { clearLoginError } from "../data/LoginSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Wheat } from "lucide-react";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const query = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const loginError = useAppSelector((state) => state.login.loginError);

  const LoginFormSchema = yup.object({
    phone_number: yup
      .string()
      .matches(/^(?:\+234|0)[789][01]\d{8}$/, "Invalid phone number")
      .required("Required"),
    password: yup
      .string()
      .required("Required")
      .min(8, "Password must be at least 8 characters"),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ILoginForm>({
    mode: "all",
    resolver: yupResolver(LoginFormSchema),
    defaultValues: { password: "", phone_number: "" },
  });

  useEffect(() => {
    if (loginError) {
      enqueueSnackbar(loginError, { variant: "error" });
      dispatch(clearLoginError());
    }
  }, [loginError]);

  const [LoginUserMutation, LoginUser] = useLoginUserMutation();

  const onSubmit: SubmitHandler<ILoginForm> = (data) =>
    LoginUserMutation(data)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Login successful", { variant: "success" });
        reset();
        router.push(query.get("url") ? `${query.get("url")}` : "/dashboard");
      })
      .catch(() => {});

      return (
  <div className="w-full max-w-sm">

    {/* Mobile brand link */}
    <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 w-max">
      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
        <Wheat size={16} className="text-green-700" />
      </div>
      <span className="font-inter font-bold text-green-800 text-sm">Micro FoodBank</span>
    </Link>

    <h2 className="font-inter font-bold text-2xl text-gray-900 mb-1">
      Welcome back 👋
    </h2>
    <p className="font-inter text-sm text-gray-500 mb-8">
      Sign in to your Micro FoodBank account
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="font-inter text-sm font-medium text-gray-700">Phone Number</label>
        <input
          {...register("phone_number")}
          type="tel"
          placeholder="08012345678"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors"
        />
        {errors.phone_number && (
          <small className="text-red-500 text-xs font-inter">{errors.phone_number.message}</small>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-inter text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <small className="text-red-500 text-xs font-inter">{errors.password.message}</small>
        )}
        <Link
          href={query.get("url") ? `/auth/forgot-password?url=${query.get("url")}` : "/auth/forgot-password"}
          className="font-inter text-xs text-green-700 self-end hover:text-green-800"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={LoginUser.isLoading}
        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 disabled:text-gray-400 text-green-900 font-inter font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {LoginUser.isLoading ? (
          <><Loader2 size={16} className="animate-spin" />Signing in...</>
        ) : (
          "Sign In →"
        )}
      </button>
    </form>

    <p className="font-inter text-sm text-gray-500 text-center mt-6">
      New to Micro FoodBank?{" "}
      <Link
        href={query.get("url") ? `/auth/register?url=${query.get("url")}` : "/auth/register"}
        className="text-green-700 font-semibold hover:text-green-800"
      >
        Create an account
      </Link>
    </p>
  </div>
);
};

export default LoginForm;