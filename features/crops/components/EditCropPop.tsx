// features/crops/components/EditCropPop.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import { clearCropsError, setShowUpdateCropModal } from "../data/CropSlice";
import { useEditACropMutation } from "../data/CropApi";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmlrvkbnp';

// Helper function to get full Cloudinary URL or complete image path
const getFullImageUrl = (imgPath: string | undefined): string | null => {
  if (!imgPath || typeof imgPath !== 'string' || imgPath.trim() === "") return null;
  
  const trimmedPath = imgPath.trim();
  
  // If it's already a full URL, return as is
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }
  
  // If it's a Cloudinary path, construct the full URL
  if (trimmedPath.includes('image/upload/') || trimmedPath.match(/^v\d+\//) || !trimmedPath.includes('/')) {
    const path = trimmedPath.includes('/') ? trimmedPath : `image/upload/${trimmedPath}`;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${path}`;
  }
  
  // Fallback
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${trimmedPath}`;
};

const EditCropPop = () => {
  const dispatch = useAppDispatch();
  const [showUploadPhoto, setShowUploadPhoto] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showUpdateCropModal = useAppSelector(
    (state) => state.crops.showUpdateCropModal
  );
  const updateCropsLoading = useAppSelector(
    (state) => state.crops.updateCropsLoading
  );
  const updateCropsError = useAppSelector(
    (state) => state.crops.updateCropsError
  );
  const selectedCrop = useAppSelector((state) => state.crops.selectedCrop);

  const [EditACropMutation] = useEditACropMutation();
  
  // Memoize the image URL
  const imageSrc = useMemo(
    () => getFullImageUrl(selectedCrop?.img) || "",
    [selectedCrop?.img]
  );

  useEffect(() => {
    if (updateCropsError) {
      enqueueSnackbar(updateCropsError, { variant: "error" });
      dispatch(clearCropsError());
    }
  }, [updateCropsError, dispatch]);

  const CropSchema = yup
    .object({
      crop_description: yup.string().required("Required"),
      crop_name: yup.string().required("Required"),
      harvested_date: yup.string().nullable(),
      img: yup.mixed<File | string>().nullable(),
      location: yup.string().required("Required"),
      price_per_unit: yup.number().required("Required"),
      quantity: yup.number().min(1).required("Required"),
      unit: yup.string().required("Required"),
      id: yup.number().required("Required"),
      farmer_name: yup.string().required("Required"),
      is_Organic: yup.boolean().required("Required"),
      availability: yup.string().required("Required"),
      created_at: yup.string().required("Required"),
      farmer: yup.number().required("Required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<ICropInput>({
    mode: "all",
    resolver: yupResolver(CropSchema),
    defaultValues: {
      crop_description: "",
      crop_name: "",
      harvested_date: null,
      img: undefined,
      location: "",
      price_per_unit: 0,
      quantity: 0,
      unit: "",
      availability: "",
      created_at: "",
      farmer: 0,
      farmer_name: "",
      id: 0,
      is_Organic: false,
    },
  });

  useEffect(() => {
    if (selectedCrop) {
      reset({
        ...selectedCrop,
        harvested_date: selectedCrop.harvested_date || null,
      });
    }
  }, [selectedCrop]);

  const getChangedFieldsFromDirty = (): Partial<ICropInput> => {
    const currentValues = getValues();
    const changed: Record<string, any> = {};
    
    // Always include img if a new file was selected
    if (selectedFile) {
      changed.img = selectedFile;
    }
    
    (Object.keys(dirtyFields) as Array<keyof ICropInput>).forEach((key) => {
      if (key && dirtyFields[key] && key !== 'img') { // Skip img as we already handled it
        changed[key] = currentValues[key];
      }
    });
    
    return changed;
  };

  const onSubmit: SubmitHandler<ICropInput> = async () => {
    let changedFromDirty = getChangedFieldsFromDirty();

    // If no changes and no new image, don't submit
    if (Object.keys(changedFromDirty).length === 0) {
      enqueueSnackbar("No changes to update", { variant: "info" });
      return dispatch(setShowUpdateCropModal({ show: false }));
    }

    const formData = new FormData();
    
    Object.entries(changedFromDirty).forEach(([key, value]) => {
      // Skip undefined or null values
      if (value === undefined || value === null) return;
      
      // Handle Date object (harvested_date) - Format to YYYY-MM-DD
      if (key === 'harvested_date' && value instanceof Date) {
        const formattedDate = value.toISOString().split('T')[0];
        formData.append(key, formattedDate);
        console.log(`Appending ${key}: ${formattedDate}`);
      } 
      // Handle File object (image upload)
      else if (value instanceof File) {
        // ✅ Important: Use the correct field name that backend expects
        formData.append('img', value);
        console.log(`Appending img: ${value.name} (${value.size} bytes, type: ${value.type})`);
      } 
      // Handle everything else
      else {
        const stringValue = value.toString();
        formData.append(key, stringValue);
        console.log(`Appending ${key}: ${stringValue}`);
      }
    });

    // Log all FormData for debugging
    console.log("=== FINAL FORM DATA SUBMISSION ===");
    for (const pair of formData.entries()) {
      if (pair[0] === 'img' && pair[1] instanceof File) {
        console.log(pair[0], 'File:', pair[1].name, 'Size:', pair[1].size);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    try {
      const response = await EditACropMutation({ 
        form: formData, 
        id: selectedCrop.id 
      }).unwrap();
      
      console.log("=== UPDATE RESPONSE ===");
      console.log("Response:", response);
      console.log("New image URL:", response.img);
      
      enqueueSnackbar("Crop updated successfully", { variant: "success" });
      reset();
      setSelectedFile(null);
      setShowUploadPhoto(false);
      dispatch(setShowUpdateCropModal({ show: false }));
      
      // Optional: Dispatch an action to refresh the crops list
      // dispatch(refreshCrops());
      
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage = error?.data?.detail || error?.data?.message || error?.message || "Failed to update crop";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleCancel = useCallback(() => {
    reset();
    setSelectedFile(null);
    setShowUploadPhoto(false);
    dispatch(setShowUpdateCropModal({ show: false }));
  }, [dispatch, reset]);

  const handleImageSelect = (file: File, onChange: (value: any) => void) => {
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image must be less than 5MB", { variant: "error" });
      return;
    }
    
    setSelectedFile(file);
    onChange(file);
    // Mark that we want to change the image
    setShowUploadPhoto(false);
  };

  return (
    <Dialog
      visible={showUpdateCropModal}
      modal
      className={`mx-2 bg-white overflow-auto noScroll rounded-lg py-7 px-3 md:px-5 w-full max-w-[700px]`}
      onHide={handleCancel}
      content={({ hide }) => (
        <div className={`w-full bg-white`}>
          <h3
            className={`text-center capitalize font-Square font-semibold text-2xl text-black mb-4`}
          >
            Edit Crop
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-3`}
          >
            {/* Title */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="crop_name"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Title
              </label>
              <InputText id="crop_name" {...register("crop_name")} />
              {errors.crop_name && (
                <small className="p-error">{errors.crop_name.message}</small>
              )}
            </div>

            {/* Description */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="crop_description"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Description
              </label>
              <InputTextarea
                id="crop_description"
                className={`resize-none`}
                {...register("crop_description")}
              />
              {errors.crop_description && (
                <small className="p-error">
                  {errors.crop_description.message}
                </small>
              )}
            </div>

            {/* Harvest Date */}
            <div className={`flex flex-col gap-2 w-full`}>
              <label
                htmlFor="harvested_date"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Date of Harvest
              </label>
              <Controller
                name="harvested_date"
                control={control}
                render={({ field }) => (
                  <Calendar
                    inputId="harvested_date"
                    dateFormat="yy-mm-dd"
                    value={field.value ? new Date(field.value) : null}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    showIcon
                    iconPos="left"
                  />
                )}
              />
              {errors.harvested_date && (
                <small className="p-error">
                  {errors.harvested_date.message}
                </small>
              )}
            </div>

            {/* Quantity & Unit Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex flex-col gap-2`}>
                <label
                  htmlFor="quantity"
                  className={`font-inter font-medium text-sm text-gray-500`}
                >
                  Quantity
                </label>
                <InputText
                  id="quantity"
                  keyfilter="num"
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <small className="p-error">{errors.quantity.message}</small>
                )}
              </div>

              <div className={`flex flex-col gap-2`}>
                <label
                  htmlFor="unit"
                  className={`font-inter font-medium text-sm text-gray-500`}
                >
                  Unit
                </label>
                <InputText id="unit" {...register("unit")} />
                {errors.unit && (
                  <small className="p-error">{errors.unit.message}</small>
                )}
              </div>
            </div>

            {/* Location */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="location"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Location
              </label>
              <InputText id="location" {...register("location")} />
              {errors.location && (
                <small className="p-error">{errors.location.message}</small>
              )}
            </div>

            {/* Price */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="price_per_unit"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Price per Unit
              </label>
              <InputText
                id="price_per_unit"
                keyfilter="money"
                {...register("price_per_unit")}
              />
              {errors.price_per_unit && (
                <small className="p-error">
                  {errors.price_per_unit.message}
                </small>
              )}
            </div>

            {/* Availability */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="availability"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Availability
              </label>
              <Controller
                name="availability"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="AVAILABLE"
                        checked={field.value === "AVAILABLE"}
                        onChange={() => field.onChange("AVAILABLE")}
                      />
                      Available
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="OUT_OF_STOCK"
                        checked={field.value === "OUT_OF_STOCK"}
                        onChange={() => field.onChange("OUT_OF_STOCK")}
                      />
                      Out of Stock
                    </label>
                  </div>
                )}
              />
              {errors.availability && (
                <small className="p-error">{errors.availability.message}</small>
              )}
            </div>

            {/* Organic */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="is_Organic"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Organic
              </label>
              <Controller
                name="is_Organic"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="true"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="false"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                      />
                      No
                    </label>
                  </div>
                )}
              />
            </div>

            {/* Image Upload */}
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="img"
                className={`font-inter font-medium text-sm flex items-center gap-2 text-gray-500`}
              >
                Crop Image
                <span
                  className={`bg-primary px-3 py-1 rounded-2xl text-white cursor-pointer font-inter text-sm font-medium`}
                  onClick={() => setShowUploadPhoto(!showUploadPhoto)}
                >
                  {showUploadPhoto ? "Cancel" : "Change Photo"}
                </span>
              </label>
              
              {showUploadPhoto ? (
                <Controller
                  name="img"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      customUpload
                      name={field.name}
                      onSelect={(e) => {
                        const file = e.files[0];
                        handleImageSelect(file, field.onChange);
                      }}
                      accept="image/*"
                      maxFileSize={5000000}
                      emptyTemplate={
                        <p className="m-0">Drag and drop or click to select a new image (max 5MB)</p>
                      }
                    />
                  )}
                />
              ) : selectedFile ? (
                <div className="flex flex-col gap-2">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-[200px] h-[200px] object-cover rounded"
                  />
                  <p className="text-sm text-green-600">New image selected: {selectedFile.name}</p>
                </div>
              ) : imageSrc ? (
                <Image
                  preview
                  width="200px"
                  height="200px"
                  src={imageSrc}
                  alt="Crop image"
                  className="max-w-[200px]"
                />
              ) : (
                <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-200 rounded">
                  <span className="text-gray-500 text-sm">No image available</span>
                </div>
              )}
              {errors.img && (
                <small className="p-error">{errors.img.message}</small>
              )}
            </div>

            {/* Buttons */}
            <div className={`flex gap-3 flex-col-reverse w-full md:flex-row`}>
              <Button
                type="button"
                disabled={updateCropsLoading}
                onClick={hide}
                outlined
                severity="danger"
                className={`flex justify-center w-full items-center font-square font-medium text-sm`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updateCropsLoading}
                className={`flex flex-row-reverse gap-2 justify-center primary w-full items-center font-square font-medium text-sm`}
              >
                Update Crop
              </Button>
            </div>
          </form>
        </div>
      )}
    />
  );
};

export default EditCropPop;