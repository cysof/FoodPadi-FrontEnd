// features/crops/components/AddCropPop.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import { clearCropsError, setShowCreateCropModal } from "../data/CropSlice";
import { useCreateCropMutation } from "../data/CropApi";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";

// Add interface for form data
interface ICropForm {
  crop_description: string;
  crop_name: string;
  harvested_date: string;
  img: File | null;
  location: string;
  price_per_unit: number;
  quantity: number;
  unit: string;
  availability: string;
}

const AddCropPop = () => {
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showCreateCropModal = useAppSelector(
    (state) => state.crops.showCreateCropModal
  );
  const createCropsLoading = useAppSelector(
    (state) => state.crops.createCropsLoading
  );
  const createCropsError = useAppSelector(
    (state) => state.crops.createCropsError
  );

  const [CreateCropMutation] = useCreateCropMutation();

  useEffect(() => {
    if (createCropsError) {
      enqueueSnackbar(createCropsError, { variant: "error" });
      dispatch(clearCropsError());
    }
  }, [createCropsError, dispatch]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const CropSchema = yup
    .object({
      crop_description: yup.string().required("Description is required"),
      crop_name: yup.string().required("Title is required"),
      harvested_date: yup.string().required("Harvest date is required"),
      img: yup.mixed<File>()
        .required("Image is required")
        .test("fileType", "Only image files are allowed", (value) => {
          if (!value) return true;
          return value instanceof File && value.type.startsWith("image/");
        })
        .test("fileSize", "File size must be less than 5MB", (value) => {
          if (!value) return true;
          return value instanceof File && value.size <= 5 * 1024 * 1024;
        }),
      location: yup.string().required("Location is required"),
      price_per_unit: yup.number()
        .typeError("Price must be a number")
        .required("Price per unit is required")
        .positive("Price must be positive"),
      quantity: yup.number()
        .typeError("Quantity must be a number")
        .min(1, "Quantity must be at least 1")
        .required("Quantity is required"),
      unit: yup.string().required("Unit is required"),
      availability: yup.string().required("Availability is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICropForm>({
    mode: "all",
    resolver: yupResolver(CropSchema),
    defaultValues: {
      crop_description: "",
      crop_name: "",
      harvested_date: "",
      img: null,
      location: "",
      price_per_unit: 0,
      quantity: 0,
      unit: "",
      availability: "",
    },
  });

  const handleImageSelect = (file: File, onChange: (file: File) => void) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image size must be less than 5MB", { variant: "error" });
      return;
    }
    
    // Clean up old preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Set new image and preview
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    onChange(file);
  };

  const onSubmit: SubmitHandler<ICropForm> = async (data: ICropForm) => {
    if (!data.img) {
      enqueueSnackbar("Please select an image", { variant: "error" });
      return;
    }

    setIsUploading(true);
    
    const { harvested_date, img, ...restData } = data;

    const formData = new FormData();
    
    // Append image with proper filename
    formData.append("img", img, img.name);
    
    // Append other fields
    Object.entries(restData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    // Format date properly
    const formattedDate = new Date(harvested_date).toISOString().split("T")[0];
    formData.append("harvested_date", formattedDate);

    try {
      const result = await CreateCropMutation(formData).unwrap();
      console.log("Crop created successfully:", result);
      console.log("Uploaded image URL:", result.img);
      
      enqueueSnackbar("Crop created successfully", { variant: "success" });
      reset();
      setSelectedImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      dispatch(setShowCreateCropModal(false));
    } catch (error: any) {
      console.error("Error creating crop:", error);
      enqueueSnackbar(
        error?.data?.detail || error?.data?.message || "Failed to create crop", 
        { variant: "error" }
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    dispatch(setShowCreateCropModal(false));
  };

  return (
    <Dialog
      visible={showCreateCropModal}
      modal
      className="mx-2 bg-white overflow-auto noScroll rounded-lg py-7 px-3 md:px-5 w-full max-w-[700px]"
      onHide={handleCancel}
      content={({ hide }) => (
        <div className="w-full bg-white">
          <h3 className="text-center capitalize font-Square font-semibold text-2xl text-black mb-4">
            Add New Crop
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label htmlFor="crop_name" className="font-inter font-medium text-sm text-gray-500">
                Title *
              </label>
              <InputText id="crop_name" {...register("crop_name")} />
              {errors.crop_name && (
                <small className="text-red-500">{errors.crop_name.message}</small>
              )}
            </div>
            
            {/* Description */}
            <div className="flex flex-col gap-2">
              <label htmlFor="crop_description" className="font-inter font-medium text-sm text-gray-500">
                Description *
              </label>
              <InputTextarea
                id="crop_description"
                rows={3}
                className="resize-none"
                {...register("crop_description")}
              />
              {errors.crop_description && (
                <small className="text-red-500">{errors.crop_description.message}</small>
              )}
            </div>
            
            {/* Harvest Date */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="harvested_date" className="font-inter font-medium text-sm text-gray-500">
                Date of Harvest *
              </label>
              <Controller
                name="harvested_date"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1">
                    <Calendar
                      inputId="harvested_date"
                      dateFormat="yy-mm-dd"
                      value={field.value ? new Date(field.value) : null}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.value)}
                      showIcon
                      iconPos="left"
                      aria-label="Select harvest date"
                    />
                  </div>
                )}
              />
              {errors.harvested_date && (
                <small className="text-red-500">{errors.harvested_date.message}</small>
              )}
            </div>
            
            {/* Quantity & Unit Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="quantity" className="font-inter font-medium text-sm text-gray-500">
                  Quantity *
                </label>
                <InputText 
                  id="quantity" 
                  type="number" 
                  min="1"
                  {...register("quantity")} 
                />
                {errors.quantity && (
                  <small className="text-red-500">{errors.quantity.message}</small>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="unit" className="font-inter font-medium text-sm text-gray-500">
                  Unit *
                </label>
                <InputText id="unit" {...register("unit")} />
                {errors.unit && (
                  <small className="text-red-500">{errors.unit.message}</small>
                )}
              </div>
            </div>
            
            {/* Location */}
            <div className="flex flex-col gap-2">
              <label htmlFor="location" className="font-inter font-medium text-sm text-gray-500">
                Location *
              </label>
              <InputText id="location" {...register("location")} />
              {errors.location && (
                <small className="text-red-500">{errors.location.message}</small>
              )}
            </div>
            
            {/* Price */}
            <div className="flex flex-col gap-2">
              <label htmlFor="price_per_unit" className="font-inter font-medium text-sm text-gray-500">
                Price per Unit (₦) *
              </label>
              <InputText 
                id="price_per_unit" 
                type="number" 
                step="0.01"
                min="0"
                {...register("price_per_unit")} 
              />
              {errors.price_per_unit && (
                <small className="text-red-500">{errors.price_per_unit.message}</small>
              )}
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-2">
              <label htmlFor="availability" className="font-inter font-medium text-sm text-gray-500">
                Availability *
              </label>
              <Controller
                name="availability"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    inputId="availability"
                    options={[
                      { label: "Available", value: "AVAILABLE" },
                      { label: "Out of Stock", value: "OUT_OF_STOCK" }
                    ]}
                    placeholder="Select availability"
                    className="w-full"
                  />
                )}
              />
              {errors.availability && (
                <small className="text-red-500">{errors.availability.message}</small>
              )}
            </div>
            
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label htmlFor="img" className="font-inter font-medium text-sm text-gray-500">
                Upload Crop Image *
              </label>
              <Controller
                name="img"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <FileUpload
                      customUpload
                      name={field.name}
                      onSelect={(e) => handleImageSelect(e.files[0], field.onChange)}
                      accept="image/*"
                      maxFileSize={5000000}
                      chooseLabel="Select Image"
                      cancelLabel="Cancel"
                      emptyTemplate={
                        <p className="m-0 text-gray-500">
                          Drag and drop or click to select an image (max 5MB)
                        </p>
                      }
                    />
                    
                    {imagePreview && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-green-600">
                          ✓ Selected: {selectedImage?.name}
                        </p>
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-h-48 object-cover rounded border border-gray-300"
                          />
                          <Button
                            type="button"
                            icon="pi pi-times"
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              field.onChange(null);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.img && (
                <small className="text-red-500">{errors.img.message}</small>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3 flex-col-reverse w-full md:flex-row mt-4">
              <Button
                type="button"
                disabled={createCropsLoading || isUploading}
                onClick={handleCancel}
                outlined
                severity="danger"
                className="flex justify-center w-full items-center font-square font-medium text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createCropsLoading || isUploading}
                className="flex flex-row-reverse gap-2 justify-center primary w-full items-center font-square font-medium text-sm"
              >
                Post Crop
              </Button>
            </div>
          </form>
        </div>
      )}
    />
  );
};

export default AddCropPop;