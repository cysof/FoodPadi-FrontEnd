"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useRegisterUserMutation } from "../data/RegisterApi";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearRegisterError } from "../data/RegisterSlice";
import { useRouter, useSearchParams } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";
import { Eye, EyeOff, Loader2, Wheat, ArrowLeft } from "lucide-react";

type FormData = IRegisterForm;

const AccountForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const query = useSearchParams();
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedLGAId, setSelectedLGAId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerError = useAppSelector((state) => state.register.registerError);
  const registerLoading = useAppSelector((state) => state.register.registerLoading);
  const [RegisterUserMutation] = useRegisterUserMutation();

  const AccountFormSchema: yup.ObjectSchema<FormData> = yup.object({
    account_type: yup.string().required("Required"),
    username: yup.string().required("Required"),
    first_name: yup.string().required("Required"),
    last_name: yup.string().required("Required"),
    other_name: yup.string().default(""),
    gender: yup.string().required("Required"),
    phone_number: yup
      .string()
      .matches(/^(?:\+234|0)[789][01]\d{8}$/, "Invalid phone number")
      .required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    address_line: yup.string().required("Required"),
    city: yup.string().required("Required"),
    state: yup.number().nullable().required("Please select your state"),
    lga: yup.number().nullable().required("Please select your LGA"),
    country: yup.string().required("Required"),
    password: yup.string().required("Required").min(8, "Minimum 8 characters"),
    password_confirm: yup
      .string()
      .required("Required")
      .min(8, "Minimum 8 characters")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  }).required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(AccountFormSchema),
    defaultValues: {
      account_type: "",
      address_line: "",
      city: "",
      country: "Nigeria",
      email: "",
      first_name: "",
      gender: "",
      last_name: "",
      other_name: "",
      password: "",
      password_confirm: "",
      phone_number: "",
      state: null,
      lga: null,
      username: "",
    },
  });

  const handleStateChange = (stateId: number | null, stateName: string | null) => {
    setSelectedStateId(stateId);
    setValue("state", stateId);
    setSelectedLGAId(null);
    setValue("lga", null);
  };

  const handleLGAChange = (lgaId: number | null, lgaName: string | null) => {
    setSelectedLGAId(lgaId);
    setValue("lga", lgaId);
  };

  useEffect(() => {
    if (registerError) {
      enqueueSnackbar(registerError, { variant: "error" });
      dispatch(clearRegisterError());
    }
  }, [registerError, dispatch]);

  const onSubmit = (data: FormData) => {
    RegisterUserMutation(data)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Account created successfully!", { variant: "success" });
        reset();
        router.push(query.get("url") ? `/auth/login?url=${query.get("url")}` : "/auth/login");
      })
      .catch((error) => {
        enqueueSnackbar(error?.data?.detail || "Registration failed", { variant: "error" });
      });
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl font-inter text-sm text-gray-900 outline-none focus:border-green-500 transition-colors";
  const labelClass = "font-inter text-sm font-medium text-gray-700";
  const errorClass = "text-red-500 text-xs font-inter";

  return (
  <div className="w-full max-w-lg max-h-screen overflow-y-auto py-8">

    {/* Mobile brand */}
    <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 w-max">
      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
        <Wheat size={16} className="text-green-700" />
      </div>
      <span className="font-inter font-bold text-green-800 text-sm">FarmRide</span>
    </Link>

    {/* Back to home / browse stock without an account */}
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 font-inter text-xs text-gray-500 hover:text-green-700 mb-6 w-max transition-colors"
    >
      <ArrowLeft size={30} />
      Back to Home — Browse Available Stock
    </Link>

    <h2 className="font-inter font-bold text-2xl text-gray-900 mb-1">
      Create your account
    </h2>
    <p className="font-inter text-sm text-gray-500 mb-8">
      Join FarmRide. Connect. Trade. Deliver.
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* Personal Information */}
      <div>
        <p className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Personal Information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>First Name</label>
            <input {...register("first_name")} className={inputClass} placeholder="John" />
            {errors.first_name && <small className={errorClass}>{errors.first_name.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Last Name</label>
            <input {...register("last_name")} className={inputClass} placeholder="Doe" />
            {errors.last_name && <small className={errorClass}>{errors.last_name.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Other Name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input {...register("other_name")} className={inputClass} />
            {errors.other_name && <small className={errorClass}>{errors.other_name.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Username</label>
            <input {...register("username")} className={inputClass} placeholder="johndoe" />
            {errors.username && <small className={errorClass}>{errors.username.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select {...field} className={inputClass}>
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              )}
            />
            {errors.gender && <small className={errorClass}>{errors.gender.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Phone Number</label>
            <input {...register("phone_number")} className={inputClass} placeholder="08012345678" />
            {errors.phone_number && <small className={errorClass}>{errors.phone_number.message}</small>}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div>
        <p className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Account Details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Account Type</label>
            <Controller
              name="account_type"
              control={control}
              render={({ field }) => (
                <select {...field} className={inputClass}>
                  <option value="">Select type</option>
                  <option value="FARMER">Farmer</option>
                  <option value="BUYER">Buyer</option>
                  <option value="TRANSPORTER">Transporter</option>
                </select>
              )}
            />
            {errors.account_type && <small className={errorClass}>{errors.account_type.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email</label>
            <input {...register("email")} type="email" className={inputClass} placeholder="john@email.com" />
            {errors.email && <small className={errorClass}>{errors.email.message}</small>}
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Location
        </p>
        <div className="flex flex-col gap-3">
          <LocationPicker
            onStateChange={handleStateChange}
            onLGAChange={handleLGAChange}
            selectedStateId={selectedStateId}
            selectedLGAId={selectedLGAId}
          />
          {errors.state && <small className={errorClass}>{errors.state.message}</small>}
          {errors.lga && <small className={errorClass}>{errors.lga.message}</small>}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>City</label>
              <input {...register("city")} className={inputClass} placeholder="Lagos" />
              {errors.city && <small className={errorClass}>{errors.city.message}</small>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Address</label>
              <input {...register("address_line")} className={inputClass} placeholder="123 Farm Road" />
              {errors.address_line && <small className={errorClass}>{errors.address_line.message}</small>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Country</label>
            <input {...register("country")} defaultValue="Nigeria" className={inputClass} />
            {errors.country && <small className={errorClass}>{errors.country.message}</small>}
          </div>
        </div>
      </div>

      {/* Security */}
      <div>
        <p className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Security
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <small className={errorClass}>{errors.password.message}</small>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Confirm Password</label>
            <div className="relative">
              <input
                {...register("password_confirm")}
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password_confirm && <small className={errorClass}>{errors.password_confirm.message}</small>}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={registerLoading}
        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 disabled:text-gray-400 text-green-900 font-inter font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
      >
        {registerLoading ? (
          <><Loader2 size={16} className="animate-spin" />Creating account...</>
        ) : (
          "Create Account →"
        )}
      </button>

    </form>

    <p className="font-inter text-sm text-gray-500 text-center mt-6">
      Already have an account?{" "}
      <Link
        href={query.get("url") ? `/auth/login?url=${query.get("url")}` : "/auth/login"}
        className="text-green-700 font-semibold hover:text-green-800"
      >
        Sign in
      </Link>
    </p>

  </div>
);
};

export default AccountForm;