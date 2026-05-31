// features/account/components/ProfileSection.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../data/AccountApi";
import { enqueueSnackbar } from "notistack";
import { clearAccountErrors } from "../data/AccountSlice";
import LocationPicker from "@/components/LocationPicker";

const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedLGAId, setSelectedLGAId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Nigeria");

  const user = useAppSelector((state) => state.login.user);
  const updateProfileLoading = useAppSelector(
    (state) => state.account.updateProfileLoading
  );
  const updateProfileError = useAppSelector(
    (state) => state.account.updateProfileError
  );

  useGetProfileQuery();
  const [UpdateProfileMutation] = useUpdateProfileMutation();

  // Initialize form values from user data
  useEffect(() => {
    if (user) {
      setSelectedStateId(user.state || null);
      setSelectedLGAId(user.lga || null);
      setAddress(user.address_line || user.address || "");
      setCity(user.city || "");
      setCountry(user.country || "Nigeria");
    }
  }, [user]);

  // Handle state change from LocationPicker
  const handleStateChange = (stateId: number | null, stateName: string | null) => {
    setSelectedStateId(stateId);
    setSelectedLGAId(null);
  };

  // Handle LGA change from LocationPicker
  const handleLGAChange = (lgaId: number | null, lgaName: string | null) => {
    setSelectedLGAId(lgaId);
  };

  useEffect(() => {
    if (updateProfileError) {
      enqueueSnackbar(updateProfileError, { variant: "error" });
      dispatch(clearAccountErrors());
    }
  }, [updateProfileError, dispatch]);

  const handleSave = () => {
    const updateData: any = {};
    
    if (selectedStateId !== user?.state) {
      updateData.state = selectedStateId;
    }
    if (selectedLGAId !== user?.lga) {
      updateData.lga = selectedLGAId;
    }
    if (address !== (user?.address_line || user?.address)) {
      updateData.address_line = address;
    }
    if (city !== user?.city) {
      updateData.city = city;
    }
    if (country !== user?.country) {
      updateData.country = country;
    }
    
    if (Object.keys(updateData).length === 0) {
      enqueueSnackbar("No changes to update", { variant: "info" });
      return;
    }
    
    UpdateProfileMutation(updateData)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      });
  };

  return (
    <div className={`flex flex-col gap-5`}>
      <div className={`flex flex-col gap-1`}>
        <h3 className={`font-square font-bold text-2xl text-primary-black`}>
          Profile Information
        </h3>
        <p className={`font-inter text-sm text-gray-500`}>
          Your personal information is read-only. Only location can be updated.
        </p>
      </div>
      
      {/* Read-only Information Section */}
      <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200`}>
        <h4 className={`font-square font-semibold text-lg text-primary-black mb-4`}>
          Personal Information (Read-only)
        </h4>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div>
            <label className={`font-inter text-sm text-gray-500`}>First Name</label>
            <p className={`font-inter text-base text-primary-black mt-1`}>
              {user?.first_name || "-"}
            </p>
          </div>
          <div>
            <label className={`font-inter text-sm text-gray-500`}>Last Name</label>
            <p className={`font-inter text-base text-primary-black mt-1`}>
              {user?.last_name || "-"}
            </p>
          </div>
          <div>
            <label className={`font-inter text-sm text-gray-500`}>Username</label>
            <p className={`font-inter text-base text-primary-black mt-1`}>
              {user?.username || "-"}
            </p>
          </div>
          <div>
            <label className={`font-inter text-sm text-gray-500`}>Email</label>
            <p className={`font-inter text-base text-primary-black mt-1`}>
              {user?.email || "-"}
            </p>
          </div>
          <div>
            <label className={`font-inter text-sm text-gray-500`}>Phone Number</label>
            <p className={`font-inter text-base text-primary-black mt-1`}>
              {user?.phone_number || "-"}
            </p>
          </div>
          <div>
            <label className={`font-inter text-sm text-gray-500`}>Gender</label>
            <p className={`font-inter text-base text-primary-black mt-1`}>
              {user?.gender || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Location Section */}
      <div className={`bg-white p-4 rounded-lg border border-gray-200`}>
        <h4 className={`font-square font-semibold text-lg text-primary-black mb-4`}>
          Location Information (Editable)
        </h4>
        
        {/* State and LGA using LocationPicker */}
        <div className={`mb-4`}>
          <LocationPicker
            onStateChange={handleStateChange}
            onLGAChange={handleLGAChange}
            selectedStateId={selectedStateId}
            selectedLGAId={selectedLGAId}
          />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              City
            </label>
            <InputText 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              className="w-full"
            />
          </div>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Address
            </label>
            <InputText 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full"
            />
          </div>
        </div>

        <div className={`mt-4`}>
          <div className={`flex flex-col gap-1`}>
            <label className={`font-inter text-sm text-gray-500`}>
              Country
            </label>
            <InputText 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className={`flex justify-end`}>
        <Button
          loading={updateProfileLoading}
          className={`primary px-7`}
          onClick={handleSave}
        >
          Save Location Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection;