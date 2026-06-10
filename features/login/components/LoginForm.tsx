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
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-green-950 via-green-800 to-green-700 px-10 py-12 relative overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, #f5c518 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative">
          {/* Brand — clicks to home */}
          <Link href="/" className="flex items-center gap-3 mb-12 w-max">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Wheat size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-bold text-base font-inter">Micro FoodBank</p>
              <p className="text-white/50 text-xs font-inter">Feeding African Homes</p>
            </div>
          </Link>

          <h1 className="font-inter font-bold text-3xl text-white leading-snug mb-3">
            Nigeria's <span className="text-yellow-400">Agricultural</span><br />Marketplace
          </h1>
          <p className="font-inter text-sm text-white/70 leading-relaxed mb-10">
            Connect directly with farmers, buyers, and transporters across Nigeria.
          </p>

          {/* Role cards */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "🌱", title: "Farmers", desc: "List your produce and reach thousands of buyers directly." },
              { icon: "🛒", title: "Buyers", desc: "Order fresh farm produce delivered to your doorstep." },
              { icon: "🚚", title: "Transporters", desc: "Get paired with deliveries and earn on every trip." },
            ].map((role) => (
              <div key={role.title} className="flex items-start gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-400/20 flex items-center justify-center text-lg flex-shrink-0">
                  {role.icon}
                </div>
                <div>
                  <p className="font-inter font-semibold text-white text-sm">{role.title}</p>
                  <p className="font-inter text-xs text-white/60 leading-relaxed">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative font-inter text-xs text-white/30 mt-8">
          © {new Date().getFullYear()} Micro FoodBank. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-white px-6 py-12 min-h-screen">
        <div className="w-full max-w-sm">

          {/* Mobile brand link */}
          <Link href="/" className="flex md:hidden items-center gap-2 mb-8 w-max">
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

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register("phone_number")}
                type="tel"
                placeholder="08012345678"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors"
              />
              {errors.phone_number && (
                <small className="text-red-500 text-xs font-inter">
                  {errors.phone_number.message}
                </small>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-sm font-medium text-gray-700">
                Password
              </label>
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
                <small className="text-red-500 text-xs font-inter">
                  {errors.password.message}
                </small>
              )}
              <Link
                href={query.get("url") ? `/auth/forgot-password?url=${query.get("url")}` : "/auth/forgot-password"}
                className="font-inter text-xs text-green-700 self-end hover:text-green-800"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={LoginUser.isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 disabled:text-gray-400 text-green-900 font-inter font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {LoginUser.isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
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
      </div>

    </div>
  );
};

export default LoginForm;