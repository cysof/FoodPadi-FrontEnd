// features/crops/components/EditCropPop.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import { clearCropsError, setShowUpdateCropModal } from "../data/CropSlice";
import { useEditACropMutation, useAddCropImageMutation, useRemoveCropImageMutation } from "../data/CropApi";
import { useGetCategoriesQuery, useGetUnitsQuery } from "@/features/marketplace/data/MarketApi";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmlrvkbnp';

const getFullImageUrl = (imgPath: string | undefined): string | null => {
  if (!imgPath || typeof imgPath !== 'string' || imgPath.trim() === "") return null;
  const trimmedPath = imgPath.trim();
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }
  if (trimmedPath.includes('image/upload/') || trimmedPath.match(/^v\d+\//) || !trimmedPath.includes('/')) {
    const path = trimmedPath.includes('/') ? trimmedPath : `image/upload/${trimmedPath}`;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${path}`;
  }
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${trimmedPath}`;
};

const EditCropPop = () => {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [localAdditionalImages, setLocalAdditionalImages] = useState<ICropImage[]>([]);
  const [localCoverImage, setLocalCoverImage] = useState<string>("");

  const showUpdateCropModal = useAppSelector((state) => state.crops.showUpdateCropModal);
  const updateCropsLoading = useAppSelector((state) => state.crops.updateCropsLoading);
  const updateCropsError = useAppSelector((state) => state.crops.updateCropsError);
  const selectedCrop = useAppSelector((state) => state.crops.selectedCrop);

  const [EditACropMutation] = useEditACropMutation();
  const [addCropImage, { isLoading: addingImage }] = useAddCropImageMutation();
  const [removeCropImage, { isLoading: removingImage }] = useRemoveCropImageMutation();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: units = [] } = useGetUnitsQuery();

  const imageSrc = useMemo(
    () => getFullImageUrl(selectedCrop?.img as string) || "",
    [selectedCrop?.img]
  );

  useEffect(() => {
    if (updateCropsError) {
      enqueueSnackbar(updateCropsError, { variant: "error" });
      dispatch(clearCropsError());
    }
  }, [updateCropsError, dispatch]);

  const CropSchema = yup.object({
    crop_description: yup.string().required("Required"),
    crop_name: yup.string().required("Required"),
    category: yup.number().typeError("Category is required").required("Required"),
    harvested_date: yup.string().nullable(),
    img: yup.mixed<File | string>().nullable(),
    location: yup.string().required("Required"),
    price_per_unit: yup.number().required("Required"),
    quantity: yup.number().min(1).required("Required"),
    unit: yup.number().typeError("Unit is required").required("Required"),
    custom_unit_note: yup.string().optional(),
    id: yup.number().required("Required"),
    farmer_name: yup.string().required("Required"),
    is_Organic: yup.boolean().required("Required"),
    availability: yup.string().required("Required"),
    created_at: yup.string().required("Required"),
    farmer: yup.number().required("Required"),
  }).required();

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<ICropInput>({
    mode: "all",
    resolver: yupResolver(CropSchema) as any,
    defaultValues: {
      crop_description: "",
      crop_name: "",
      category: undefined,
      harvested_date: null,
      img: undefined,
      location: "",
      price_per_unit: 0,
      quantity: 0,
      unit: undefined,
      custom_unit_note: "",
      availability: "",
      created_at: "",
      farmer: 0,
      farmer_name: "",
      id: 0,
      is_Organic: false,
    },
  });

  const selectedUnitId = watch("unit");
  const selectedUnit = units.find((u) => u.id === selectedUnitId);
  const isOtherUnit = !!selectedUnit?.is_other;

  // Sync from selectedCrop when modal opens.
  // category/unit come back from the API as nested objects — extract just the id
  // so the dropdown can match against it, since the form submits plain IDs.
  useEffect(() => {
    if (selectedCrop) {
      const categoryId =
        typeof selectedCrop.category === "object" && selectedCrop.category
          ? selectedCrop.category.id
          : (selectedCrop.category as unknown as number);

      const unitId =
        typeof selectedCrop.unit === "object" && selectedCrop.unit
          ? selectedCrop.unit.id
          : (selectedCrop.unit as unknown as number);

      reset({
        ...selectedCrop,
        category: categoryId,
        unit: unitId,
        harvested_date: selectedCrop.harvested_date || null,
      } as any);
      setLocalAdditionalImages(selectedCrop.additional_images || []);
      setLocalCoverImage(getFullImageUrl(selectedCrop.img as string) || "");
      setSelectedFile(null);
    }
  }, [selectedCrop]);

  const getChangedFieldsFromDirty = (): Partial<ICropInput> => {
    const currentValues = getValues();
    const changed: Record<string, any> = {};

    if (selectedFile) {
      changed.img = selectedFile;
    }

    (Object.keys(dirtyFields) as Array<keyof ICropInput>).forEach((key) => {
      if (key && dirtyFields[key] && key !== 'img') {
        changed[key] = currentValues[key];
      }
    });

    return changed;
  };

  const onSubmit: SubmitHandler<ICropInput> = async () => {
    let changedFromDirty = getChangedFieldsFromDirty();

    if (Object.keys(changedFromDirty).length === 0) {
      enqueueSnackbar("No changes to update", { variant: "info" });
      return dispatch(setShowUpdateCropModal({ show: false }));
    }

    const currentValues = getValues();
    if (isOtherUnit && !currentValues.custom_unit_note?.trim()) {
      enqueueSnackbar("Please describe the unit when selecting 'Other'", { variant: "error" });
      return;
    }

    const formData = new FormData();

    Object.entries(changedFromDirty).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === 'harvested_date' && value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else if (value instanceof File) {
        formData.append('img', value);
      } else {
        formData.append(key, value.toString());
      }
    });

    try {
      await EditACropMutation({ form: formData, id: selectedCrop.id }).unwrap();
      enqueueSnackbar("Crop updated successfully", { variant: "success" });
      reset();
      setSelectedFile(null);
      setLocalAdditionalImages([]);
      setLocalCoverImage("");
      dispatch(setShowUpdateCropModal({ show: false }));
    } catch (error: any) {
      enqueueSnackbar(
        error?.data?.detail || error?.data?.message || "Failed to update crop",
        { variant: "error" }
      );
    }
  };

  const handleCancel = useCallback(() => {
    reset();
    setSelectedFile(null);
    setLocalAdditionalImages([]);
    setLocalCoverImage("");
    dispatch(setShowUpdateCropModal({ show: false }));
  }, [dispatch, reset]);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image must be less than 5MB", { variant: "error" });
      return;
    }
    setSelectedFile(file);
    setLocalCoverImage(URL.createObjectURL(file));
    setValue("img", file);
  };

  const handleAddAdditionalImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image must be less than 5MB", { variant: "error" });
      return;
    }

    try {
      const result = await addCropImage({ id: selectedCrop.id, image: file }).unwrap();
      setLocalAdditionalImages((prev) => [...prev, result]);
      enqueueSnackbar("Image added successfully", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(
        error?.data?.detail || "Failed to add image",
        { variant: "error" }
      );
    }
    e.target.value = "";
  };

  const handleRemoveAdditionalImage = async (imageId: number) => {
    try {
      await removeCropImage({ cropId: selectedCrop.id, imageId }).unwrap();
      setLocalAdditionalImages((prev) => prev.filter((img) => img.id !== imageId));
      enqueueSnackbar("Image removed successfully", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(
        error?.data?.detail || "Failed to remove image",
        { variant: "error" }
      );
    }
  };

  const displayCoverImage = selectedFile
    ? URL.createObjectURL(selectedFile)
    : localCoverImage || imageSrc;

  return (
    <Dialog
      visible={showUpdateCropModal}
      modal
      className="mx-2 bg-white overflow-auto noScroll rounded-lg py-7 px-3 md:px-5 w-full max-w-[700px]"
      onHide={handleCancel}
      content={({ hide }) => (
        <div className="w-full bg-white">
          <h3 className="text-center capitalize font-Square font-semibold text-2xl text-black mb-4">
            Edit Crop
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Title</label>
              <InputText id="crop_name" {...register("crop_name")} />
              {errors.crop_name && <small className="p-error">{errors.crop_name.message}</small>}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={categories.map((c) => ({ label: c.name, value: c.id }))}
                    placeholder="Select category"
                    className="w-full"
                  />
                )}
              />
              {errors.category && <small className="p-error">{errors.category.message}</small>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Description</label>
              <InputTextarea id="crop_description" className="resize-none" {...register("crop_description")} />
              {errors.crop_description && <small className="p-error">{errors.crop_description.message}</small>}
            </div>

            {/* Harvest Date */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Date of Harvest</label>
              <Controller
                name="harvested_date"
                control={control}
                render={({ field }) => (
                  <Calendar
                    inputId="harvested_date"
                    dateFormat="yy-mm-dd"
                    value={field.value ? new Date(field.value) : null}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.value)}
                    showIcon
                    iconPos="left"
                  />
                )}
              />
              {errors.harvested_date && <small className="p-error">{errors.harvested_date.message}</small>}
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Quantity</label>
                <InputText id="quantity" keyfilter="num" {...register("quantity")} />
                {errors.quantity && <small className="p-error">{errors.quantity.message}</small>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">Selling unit</label>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={units.map((u) => ({ label: u.name, value: u.id }))}
                      placeholder="Select unit"
                      className="w-full"
                    />
                  )}
                />
                {errors.unit && <small className="p-error">{errors.unit.message}</small>}
              </div>
            </div>

            {/* Custom unit note — only shown when "Other" is selected */}
            {isOtherUnit && (
              <div className="flex flex-col gap-2">
                <label className="font-inter font-medium text-sm text-gray-500">
                  Describe your unit
                </label>
                <InputText
                  placeholder="e.g. paint rubber, olodo, derica"
                  {...register("custom_unit_note")}
                />
              </div>
            )}

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Location</label>
              <InputText id="location" {...register("location")} />
              {errors.location && <small className="p-error">{errors.location.message}</small>}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Price per Unit</label>
              <InputText id="price_per_unit" keyfilter="money" {...register("price_per_unit")} />
              {errors.price_per_unit && <small className="p-error">{errors.price_per_unit.message}</small>}
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Availability</label>
              <Controller
                name="availability"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input type="radio" value="AVAILABLE" checked={field.value === "AVAILABLE"} onChange={() => field.onChange("AVAILABLE")} />
                      Available
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" value="OUT_OF_STOCK" checked={field.value === "OUT_OF_STOCK"} onChange={() => field.onChange("OUT_OF_STOCK")} />
                      Out of Stock
                    </label>
                  </div>
                )}
              />
              {errors.availability && <small className="p-error">{errors.availability.message}</small>}
            </div>

            {/* Organic */}
            <div className="flex flex-col gap-2">
              <label className="font-inter font-medium text-sm text-gray-500">Organic</label>
              <Controller
                name="is_Organic"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input type="radio" value="true" checked={field.value === true} onChange={() => field.onChange(true)} />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" value="false" checked={field.value === false} onChange={() => field.onChange(false)} />
                      No
                    </label>
                  </div>
                )}
              />
            </div>

            {/* Image Management with Local State */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="font-inter font-medium text-sm text-gray-500">
                  Crop Images
                  <span className="text-gray-400 ml-1">
                    ({1 + localAdditionalImages.length}/4)
                  </span>
                </label>
              </div>

              {/* Cover Image */}
              <div className="flex flex-col gap-2">
                <p className="font-inter text-xs font-medium text-gray-500">Cover Image</p>
                <div className="relative w-full h-48">
                  {displayCoverImage ? (
                    <img
                      src={displayCoverImage}
                      alt="Cover"
                      className="w-full h-full object-cover rounded-xl border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                      <i className="pi pi-image text-3xl text-gray-400" />
                    </div>
                  )}
                  <label className="absolute bottom-2 right-2 bg-primary text-white text-xs px-3 py-1 rounded-full cursor-pointer">
                    Change Cover
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
              {/* Additional Images */}
              <div className="flex flex-col gap-2">
                <p className="font-inter text-xs font-medium text-gray-500">
                  Additional Images <span className="text-gray-400">(optional, max 3)</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {localAdditionalImages.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.image_url}
                        alt="Additional"
                        className="w-full h-24 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        disabled={removingImage}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                        onClick={() => handleRemoveAdditionalImage(img.id)}
                      >
                        <i className="pi pi-times text-xs" />
                      </button>
                    </div>
                  ))}
                  {localAdditionalImages.length < 3 && (
                    <label className={`flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors ${addingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      {addingImage ? (
                        <i className="pi pi-spin pi-spinner text-xl text-gray-400" />
                      ) : (
                        <>
                          <i className="pi pi-plus text-xl text-gray-400" />
                          <p className="font-inter text-xs text-gray-400 mt-1">Add photo</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddAdditionalImage}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-3 flex-col-reverse w-full md:flex-row">
              <Button
                type="button"
                disabled={updateCropsLoading}
                onClick={hide}
                outlined
                severity="danger"
                className="flex justify-center w-full items-center font-square font-medium text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updateCropsLoading}
                className="flex flex-row-reverse gap-2 justify-center primary w-full items-center font-square font-medium text-sm"
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
