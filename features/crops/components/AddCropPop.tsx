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
import { Dropdown } from "primereact/dropdown";

interface ICropForm {
  crop_description: string;
  crop_name: string;
  harvested_date: string;
  img: File;
  location: string;
  price_per_unit: number;
  quantity: number;
  unit: string;
  availability: string;
}

interface IImagePreview {
  file: File;
  preview: string;
}

const AddCropPop = () => {
  const dispatch = useAppDispatch();
  const [primaryImage, setPrimaryImage] = useState<IImagePreview | null>(null);
  const [additionalImages, setAdditionalImages] = useState<IImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const showCreateCropModal = useAppSelector((state) => state.crops.showCreateCropModal);
  const createCropsLoading = useAppSelector((state) => state.crops.createCropsLoading);
  const createCropsError = useAppSelector((state) => state.crops.createCropsError);
  const [CreateCropMutation] = useCreateCropMutation();

  useEffect(() => {
    if (createCropsError) {
      enqueueSnackbar(createCropsError, { variant: "error" });
      dispatch(clearCropsError());
    }
  }, [createCropsError, dispatch]);

  useEffect(() => {
    return () => {
      if (primaryImage) URL.revokeObjectURL(primaryImage.preview);
      additionalImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const CropSchema = yup.object({
    crop_description: yup.string().required("Description is required"),
    crop_name: yup.string().required("Title is required"),
    harvested_date: yup.string().required("Harvest date is required"),
    img: yup.mixed<File>()
      .required("Cover image is required")
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return false;
        return value instanceof File && value.type.startsWith("image/");
      })
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (!value) return false;
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
  }).required();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ICropForm>({
    mode: "all",
    resolver: yupResolver(CropSchema) as any,
    defaultValues: {
      crop_description: "",
      crop_name: "",
      harvested_date: "",
      img: undefined as unknown as File,
      location: "",
      price_per_unit: 0,
      quantity: 0,
      unit: "",
      availability: "",
    },
  });

  const validateAndCreatePreview = (file: File): IImagePreview | null => {
    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image size must be less than 5MB", { variant: "error" });
      return null;
    }
    return { file, preview: URL.createObjectURL(file) };
  };

  const handlePrimaryImageSelect = (file: File, onChange: (file: File) => void) => {
    const result = validateAndCreatePreview(file);
    if (!result) return;
    if (primaryImage) URL.revokeObjectURL(primaryImage.preview);
    setPrimaryImage(result);
    onChange(file);
  };

  const handleAdditionalImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = 1 + additionalImages.length + files.length;

    if (totalImages > 4) {
      enqueueSnackbar("Maximum 4 images allowed (1 cover + 3 additional)", { variant: "error" });
      return;
    }

    const newPreviews: IImagePreview[] = [];
    for (const file of files) {
      const result = validateAndCreatePreview(file);
      if (result) newPreviews.push(result);
    }

    setAdditionalImages((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit: SubmitHandler<ICropForm> = async (data) => {
    if (!data.img) {
      enqueueSnackbar("Please select a cover image", { variant: "error" });
      return;
    }

    setIsUploading(true);

    const { harvested_date, img, ...restData } = data;
    const formData = new FormData();

    formData.append("img", img, img.name);
    Object.entries(restData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const formattedDate = new Date(harvested_date).toISOString().split("T")[0];
    formData.append("harvested_date", formattedDate);

    additionalImages.forEach((imgPreview) => {
      formData.append("additional_images", imgPreview.file, imgPreview.file.name);
    });

    try {
      await CreateCropMutation(formData).unwrap();
      enqueueSnackbar("Crop created successfully", { variant: "success" });
      handleCancel();
    } catch (error: any) {
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
    if (primaryImage) URL.revokeObjectURL(primaryImage.preview);
    additionalImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setPrimaryImage(null);
    setAdditionalImages([]);
    dispatch(setShowCreateCropModal(false));
  };

  const remainingSlots = 3 - additionalImages.length;

  return (
    <Dialog
      visible={showCreateCropModal}
      modal
      className="mx-2 bg-white rounded-lg w-full max-w-[700px]"
      style={{ maxHeight: '90vh' }}
      onHide={handleCancel}
      content={() => (
        <div className="w-full bg-white rounded-lg flex flex-col" style={{ maxHeight: '90vh' }}>
          {/* Header — fixed */}
          <div className="px-5 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h3 className="text-center capitalize font-Square font-semibold text-2xl text-black">
              Add New Crop
            </h3>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-4 md:px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Title *</label>
                <InputText {...register("crop_name")} />
                {errors.crop_name && <small className="text-red-500">{errors.crop_name.message}</small>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Description *</label>
                <InputTextarea rows={3} className="resize-none" {...register("crop_description")} />
                {errors.crop_description && <small className="text-red-500">{errors.crop_description.message}</small>}
              </div>

              {/* Harvest Date */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Date of Harvest *</label>
                <Controller
                  name="harvested_date"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      dateFormat="yy-mm-dd"
                      value={field.value ? new Date(field.value) : null}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.value)}
                      showIcon
                      iconPos="left"
                    />
                  )}
                />
                {errors.harvested_date && <small className="text-red-500">{errors.harvested_date.message}</small>}
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="font-inter font-medium text-sm text-gray-500">Quantity *</label>
                  <InputText type="number" min="1" {...register("quantity")} />
                  {errors.quantity && <small className="text-red-500">{errors.quantity.message}</small>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-inter font-medium text-sm text-gray-500">Unit *</label>
                  <InputText {...register("unit")} />
                  {errors.unit && <small className="text-red-500">{errors.unit.message}</small>}
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Location *</label>
                <InputText {...register("location")} />
                {errors.location && <small className="text-red-500">{errors.location.message}</small>}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Price per Unit (₦) *</label>
                <InputText type="number" step="0.01" min="0" {...register("price_per_unit")} />
                {errors.price_per_unit && <small className="text-red-500">{errors.price_per_unit.message}</small>}
              </div>

              {/* Availability */}
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Availability *</label>
                <Controller
                  name="availability"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      options={[
                        { label: "Available", value: "AVAILABLE" },
                        { label: "Out of Stock", value: "OUT_OF_STOCK" },
                      ]}
                      placeholder="Select availability"
                      className="w-full"
                    />
                  )}
                />
                {errors.availability && <small className="text-red-500">{errors.availability.message}</small>}
              </div>

              {/* Images */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="font-inter font-medium text-sm text-gray-500">
                    Crop Images * <span className="text-gray-400">(1 cover + up to 3 additional)</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    {primaryImage ? 1 + additionalImages.length : additionalImages.length}/4 images
                  </span>
                </div>

                {/* Cover Image */}
                <div className="flex flex-col gap-2">
                  <p className="font-inter text-xs font-medium text-gray-500">Cover Image *</p>
                  <Controller
                    name="img"
                    control={control}
                    render={({ field }) => (
                      <div>
                        {!primaryImage ? (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                            <i className="pi pi-image text-2xl text-gray-400" />
                            <p className="font-inter text-sm text-gray-400 mt-1">Click to upload cover image</p>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePrimaryImageSelect(file, field.onChange);
                              }}
                            />
                          </label>
                        ) : (
                          <div className="relative">
                            <img
                              src={primaryImage.preview}
                              alt="Cover"
                              className="w-full h-48 object-cover rounded-xl border border-gray-200"
                            />
                            <Button
                              type="button"
                              icon="pi pi-times"
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white border-0 flex items-center justify-center"
                              onClick={() => {
                                URL.revokeObjectURL(primaryImage.preview);
                                setPrimaryImage(null);
                                field.onChange(undefined);
                              }}
                            />
                            <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                              Cover
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {errors.img && <small className="text-red-500">{errors.img.message}</small>}
                </div>

                {/* Additional Images */}
                <div className="flex flex-col gap-2">
                  <p className="font-inter text-xs font-medium text-gray-500">
                    Additional Images <span className="text-gray-400">(optional, max 3)</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {additionalImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.preview}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border border-gray-200"
                        />
                        <Button
                          type="button"
                          icon="pi pi-times"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white border-0 flex items-center justify-center"
                          onClick={() => removeAdditionalImage(index)}
                        />
                      </div>
                    ))}
                    {remainingSlots > 0 && (
                      <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                        <i className="pi pi-plus text-xl text-gray-400" />
                        <p className="font-inter text-xs text-gray-400 mt-1">Add photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleAdditionalImageSelect}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 flex-col-reverse w-full md:flex-row mt-4 pb-2">
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
        </div>
      )}
    />
  );
};

export default AddCropPop;