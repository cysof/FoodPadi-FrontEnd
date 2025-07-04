"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useRegisterUserMutation } from "../data/RegisterApi";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearRegisterError } from "../data/RegisterSlice";
import { useRouter, useSearchParams } from "next/navigation";

const AccountForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const query = useSearchParams();

  const registerError = useAppSelector((state) => state.register.registerError);
  const registerLoading = useAppSelector(
    (state) => state.register.registerLoading
  );

  const [RegisterUserMutation] = useRegisterUserMutation();

  const AccountFormSchema = yup
    .object({
      account_type: yup.string().required("required"),
      username: yup.string().required("required"),
      first_name: yup.string().required("required"),
      last_name: yup.string().required("required"),
      other_name: yup.string().required("required"),
      gender: yup.string().required("required"),
      phone_number: yup
        .string()
        .matches(/^(?:\+234|0)[789][01]\d{8}$/, "Invalid phone number")
        .required("required"),
      email: yup
        .string()
        .email("Invalid email")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, "Invalid email")
        .required("required"),
      address: yup.string().required("required"),
      city: yup.string().required("required"),
      state: yup.string().required("required"),
      country: yup.string().required("required"),
      password: yup
        .string()
        .required("required")
        .min(8, "password must be minimum of 8 character"),
      password_confirm: yup
        .string()
        .required("required")
        .min(8, "password must be minimum of 8 character")
        .oneOf([yup.ref("password")], "Password Mismatch"),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IRegisterForm>({
    mode: "all",
    resolver: yupResolver(AccountFormSchema),
    defaultValues: {
      account_type: "",
      address: "",
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
      state: "",
      username: "",
    },
  });

  if (registerError) {
    enqueueSnackbar(registerError, { variant: "error" });
    dispatch(clearRegisterError());
  }

  // const [RequestSupportMutation] = useRequestSupportMutation();

  const onSubmit: SubmitHandler<IRegisterForm> = (data: IRegisterForm) =>
    RegisterUserMutation(data)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Account creation successful", { variant: "success" });
        reset();
        router.push(
          query.get("url")
            ? `/auth/login?url=${query.get("url")}`
            : "/auth/login"
        );
      });

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full flex flex-col gap-5 mb-5`}
      >
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>First Name</label>
            <InputText
              {...register("first_name")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.first_name && (
              <small className="p-error">{errors.first_name.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Last Name</label>
            <InputText
              {...register("last_name")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.last_name && (
              <small className="p-error">{errors.last_name.message}</small>
            )}
          </div>
        </div>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Other Name</label>
            <InputText
              {...register("other_name")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.other_name && (
              <small className="p-error">{errors.other_name.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Username</label>
            <InputText
              {...register("username")}
              className={`w-full p-inputtext-sm`}
            />
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
                  // value={selectedCity}
                  // onChange={(e) => setSelectedCity(e.value)}
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
            <InputText
              {...register("phone_number")}
              className={`w-full p-inputtext-sm`}
            />
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
                  // value={selectedCity}
                  // onChange={(e) => setSelectedCity(e.value)}
                  options={["FARMER", "BUYER", "TRANSPORTER"]}
                  placeholder="Select your gender"
                  className={`w-full p-inputtext-sm`}
                />
              )}
            />

            {errors.account_type && (
              <small className="p-error">{errors.account_type.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>email</label>
            <InputText
              {...register("email")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>
        </div>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Country</label>
            <InputText
              {...register("country")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.country && (
              <small className="p-error">{errors.country.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>State</label>
            <InputText
              {...register("state")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.state && (
              <small className="p-error">{errors.state.message}</small>
            )}
          </div>
        </div>
        <div className={`w-full flex lg:flex-row flex-col gap-3`}>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>City</label>
            <InputText
              {...register("city")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.city && (
              <small className="p-error">{errors.city.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1 w-full`}>
            <label className={`text-primary-neutral`}>Address</label>
            <InputText
              {...register("address")}
              className={`w-full p-inputtext-sm`}
            />
            {errors.address && (
              <small className="p-error">{errors.address.message}</small>
            )}
          </div>
        </div>

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
              <small className="p-error">
                {errors.password_confirm.message}
              </small>
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
