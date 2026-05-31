// features/register/components/AccountForm.tsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useRegisterUserMutation } from "../data/RegisterApi";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearRegisterError } from "../data/RegisterSlice";
import { useRouter, useSearchParams } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";

// Use the existing IRegisterForm type
type FormData = IRegisterForm;

const AccountForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const query = useSearchParams();
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedLGAId, setSelectedLGAId] = useState<number | null>(null);

  const registerError = useAppSelector((state) => state.register.registerError);
  const registerLoading = useAppSelector(
    (state) => state.register.registerLoading
  );

  const [RegisterUserMutation] = useRegisterUserMutation();

  const AccountFormSchema: yup.ObjectSchema<FormData> = yup
    .object({
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
      email: yup
        .string()
        .email("Invalid email")
        .required("Required"),
      address_line: yup.string().required("Required"),
      city: yup.string().required("Required"),
      state: yup.number().nullable().required("Please select your state"),
      lga: yup.number().nullable().required("Please select your LGA"),
      country: yup.string().required("Required"),
      password: yup
        .string()
        .required("Required")
        .min(8, "Password must be minimum of 8 characters"),
      password_confirm: yup
        .string()
        .required("Required")
        .min(8, "Password must be minimum of 8 characters")
        .oneOf([yup.ref("password")], "Password mismatch"),
    })
    .required();

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
      country: "",
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

  // Handle state change from LocationPicker
  const handleStateChange = (stateId: number | null, stateName: string | null) => {
    setSelectedStateId(stateId);
    setValue("state", stateId);
    // Reset LGA when state changes
    setSelectedLGAId(null);
    setValue("lga", null);
  };

  // Handle LGA change from LocationPicker
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
        router.push(
          query.get("url")
            ? `/auth/login?url=${query.get("url")}`
            : "/auth/login"
        );
      })
      .catch((error) => {
        enqueueSnackbar(error?.data?.detail || "Registration failed", { variant: "error" });
      });
  };

  return (
    <div
      className={`border bg-secondary border-gray-400 w-full h-max my-auto flex flex-col gap-5 max-w-2xl drop-shadow-md rounded-2xl py-10 px-3 md:px-10`}
    >
      <Image
        src={`/mainLogo.svg`}
        alt="food bank logo"
        width={400}
        height={300}
        className={`w-30 mx-auto`}
      />
      <h4 className={`text-primary-neutral text-center text-md`}>
        Join Food Bank Today. Connect. Trade. Deliver.
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className={`w-full flex flex-col gap-5 mb-5`}>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>First Name</label>
            <InputText {...register("first_name")} className={`w-full p-inputtext-sm`} />
            {errors.first_name && (
              <small className="p-error">{errors.first_name.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Last Name</label>
            <InputText {...register("last_name")} className={`w-full p-inputtext-sm`} />
            {errors.last_name && (
              <small className="p-error">{errors.last_name.message}</small>
            )}
          </div>
        </div>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Other Name (Optional)</label>
            <InputText {...register("other_name")} className={`w-full p-inputtext-sm`} />
            {errors.other_name && (
              <small className="p-error">{errors.other_name.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Username</label>
            <InputText {...register("username")} className={`w-full p-inputtext-sm`} />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>
        </div>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={["MALE", "FEMALE"]}
                  placeholder="Select your gender"
                  className={`w-full p-inputtext-sm`}
                />
              )}
            />
            {errors.gender && (
              <small className="p-error">{errors.gender.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Phone Number</label>
            <InputText {...register("phone_number")} className={`w-full p-inputtext-sm`} />
            {errors.phone_number && (
              <small className="p-error">{errors.phone_number.message}</small>
            )}
          </div>
        </div>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Account Type</label>
            <Controller
              name="account_type"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={["FARMER", "BUYER", "TRANSPORTER"]}
                  placeholder="Select account type"
                  className={`w-full p-inputtext-sm`}
                />
              )}
            />
            {errors.account_type && (
              <small className="p-error">{errors.account_type.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Email</label>
            <InputText {...register("email")} className={`w-full p-inputtext-sm`} />
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>
        </div>

        {/* Location Picker - State and LGA */}
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`w-full`}>
            <LocationPicker
              onStateChange={handleStateChange}
              onLGAChange={handleLGAChange}
              selectedStateId={selectedStateId}
              selectedLGAId={selectedLGAId}
            />
            {errors.state && (
              <small className="p-error">{errors.state.message}</small>
            )}
            {errors.lga && (
              <small className="p-error">{errors.lga.message}</small>
            )}
          </div>
        </div>

        {/* City and Address */}
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>City</label>
            <InputText {...register("city")} className={`w-full p-inputtext-sm`} />
            {errors.city && (
              <small className="p-error">{errors.city.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Address</label>
            <InputText {...register("address_line")} className={`w-full p-inputtext-sm`} />
            {errors.address_line && (
              <small className="p-error">{errors.address_line.message}</small>
            )}
          </div>
        </div>

        {/* Country */}
        <div className={`w-full flex flex-col gap-1`}>
          <label className={`text-primary-neutral`}>Country</label>
          <InputText {...register("country")} defaultValue="Nigeria" className={`w-full p-inputtext-sm`} />
          {errors.country && (
            <small className="p-error">{errors.country.message}</small>
          )}
        </div>

        {/* Password fields */}
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
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
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Confirm Password</label>
            <Controller
              name="password_confirm"
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
            {errors.password_confirm && (
              <small className="p-error">{errors.password_confirm.message}</small>
            )}
          </div>
        </div>
        
        <Button
          loading={registerLoading}
          type="submit"
          className={`flex flex-row-reverse gap-2 primary justify-center`}
        >
          Register
        </Button>
      </form>
      <p className={`flex gap-2 items-center text-primary-neutral`}>
        Already have an Account?{" "}
        <Link
          className={`text-primary`}
          href={
            query.get("url")
              ? `/auth/login?url=${query.get("url")}`
              : `/auth/login`
          }
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default AccountForm;