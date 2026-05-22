// features/account/components/ProfileSection.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { useGetProfileQuery, useUpdateProfileMutation } from "../data/AccountApi";
import { enqueueSnackbar } from "notistack";
import { clearAccountErrors } from "../data/AccountSlice";

const ProfileSection = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.login.user);
  const updateProfileLoading = useAppSelector(
    (state) => state.account.updateProfileLoading
  );
  const updateProfileError = useAppSelector(
    (state) => state.account.updateProfileError
  );

  useGetProfileQuery();

  const [UpdateProfileMutation] = useUpdateProfileMutation();

  const ProfileSchema = yup
    .object({
      first_name: yup.string().required("Required"),
      last_name: yup.string().required("Required"),
      other_name: yup.string().required("Required"),
      username: yup.string().required("Required"),
      email: yup
        .string()
        .email("Invalid email")
        .required("Required"),
      phone_number: yup
        .string()
        .matches(/^(?:\+234|0)[789][01]\d{8}$/, "Invalid phone number")
        .required("Required"),
      gender: yup.string().required("Required"),
      address: yup.string().required("Required"),
      city: yup.string().required("Required"),
      state: yup.string().required("Required"),
      country: yup.string().required("Required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUpdateProfileForm>({
    mode: "all",
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      other_name: "",
      username: "",
      email: "",
      phone_number: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  // Pre-fill form with user data from Redux
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        other_name: user.other_name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        gender: user.gender,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
      });
    }
  }, [user]);

  // ✅ Error handling in useEffect
  useEffect(() => {
    if (updateProfileError) {
      enqueueSnackbar(updateProfileError, { variant: "error" });
      dispatch(clearAccountErrors());
    }
  }, [updateProfileError]);

  const onSubmit: SubmitHandler<IUpdateProfileForm> = (data) =>
    UpdateProfileMutation(data)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
      });

  return (
    <div className={`flex flex-col gap-5`}>
      <div className={`flex flex-col gap-1`}>
        <h3 className={`font-square font-bold text-2xl text-primary-black`}>
          Profile Information
        </h3>
        <p className={`font-inter text-sm text-gray-500`}>
          Update your personal information here.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-4`}
      >
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              First Name
            </label>
            <InputText {...register("first_name")} />
            {errors.first_name && (
              <small className="p-error">{errors.first_name.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Last Name
            </label>
            <InputText {...register("last_name")} />
            {errors.last_name && (
              <small className="p-error">{errors.last_name.message}</small>
            )}
          </div>
        </div>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Other Name
            </label>
            <InputText {...register("other_name")} />
            {errors.other_name && (
              <small className="p-error">{errors.other_name.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Username
            </label>
            <InputText {...register("username")} />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>
        </div>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Email
            </label>
            <InputText {...register("email")} />
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Phone Number
            </label>
            <InputText {...register("phone_number")} />
            {errors.phone_number && (
              <small className="p-error">{errors.phone_number.message}</small>
            )}
          </div>
        </div>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Gender
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={["MALE", "FEMALE"]}
                  placeholder="Select gender"
                />
              )}
            />
            {errors.gender && (
              <small className="p-error">{errors.gender.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Country
            </label>
            <InputText {...register("country")} />
            {errors.country && (
              <small className="p-error">{errors.country.message}</small>
            )}
          </div>
        </div>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              State
            </label>
            <InputText {...register("state")} />
            {errors.state && (
              <small className="p-error">{errors.state.message}</small>
            )}
          </div>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              City
            </label>
            <InputText {...register("city")} />
            {errors.city && (
              <small className="p-error">{errors.city.message}</small>
            )}
          </div>
        </div>
        <div className={`flex flex-col gap-1`}>
          <label className={`font-inter text-sm text-gray-500`}>
            Address
          </label>
          <InputText {...register("address")} />
          {errors.address && (
            <small className="p-error">{errors.address.message}</small>
          )}
        </div>
        <div className={`flex justify-end`}>
          <Button
            type="submit"
            loading={updateProfileLoading}
            className={`primary px-7`}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;