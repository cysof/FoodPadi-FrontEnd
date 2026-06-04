// features/crops/components/EditCropPop.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useMemo, useState } from "react";
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
  
  // Memoize the image URL to avoid unnecessary recalculations
  const imageSrc = useMemo(
    () => getFullImageUrl(selectedCrop?.img) || "",
    [selectedCrop?.img]
  );

  // ✅ Fixed: moved to useEffect
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
      harvested_date: yup.string().required("Required"),
      img: yup.mixed<File | string>().required("Required"),
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
      harvested_date: "",
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
    reset(selectedCrop);
  }, [selectedCrop]);

  const getChangedFieldsFromDirty = (): Partial<ICropInput> => {
    const currentValues = getValues();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changed: Record<string, any> = {};
    (Object.keys(dirtyFields) as Array<keyof ICropInput>).forEach((key) => {
      if (key && dirtyFields[key]) {
        changed[key] = currentValues[key];
      }
    });
    return changed;
  };

  const onSubmit: SubmitHandler<ICropInput> = () => {
    const changedFromDirty = getChangedFieldsFromDirty();

    if (Object.keys(changedFromDirty).length === 0) {
      return dispatch(setShowUpdateCropModal({ show: false }));
    }

    const formData = new FormData();
    Object.entries(changedFromDirty).forEach(([key, value]) => {
      if (value instanceof Blob) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    });

    EditACropMutation({ form: formData, id: selectedCrop.id })
      .unwrap()
      .then(() => {
        reset();
        setShowUploadPhoto(false);
        dispatch(setShowUpdateCropModal({ show: false }));
      });
  };

  return (
    <Dialog
      visible={showUpdateCropModal}
      modal
      className={`mx-2 bg-white overflow-auto noScroll rounded-lg py-7 px-3 md:px-5 w-full max-w-[700px]`}
      onHide={() => {
        dispatch(setShowUpdateCropModal({ show: false }));
        setShowUploadPhoto(false);
      }}
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
            {/* ✅ Fixed: correct htmlFor on all labels */}
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
                    dateFormat={`yy-mm-dd`}
                    minDate={new Date()}
                    value={
                      field.value !== "" ? new Date(field.value) : new Date()
                    }
                    onBlur={field.onBlur}
                    onChange={field.onChange}
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
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="quantity"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Quantity
              </label>
              <InputText
                id="quantity"
                keyfilter={`num`}
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
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="price_per_unit"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Price per Unit
              </label>
              <InputText
                id="price_per_unit"
                keyfilter={`money`}
                {...register("price_per_unit")}
              />
              {errors.price_per_unit && (
                <small className="p-error">
                  {errors.price_per_unit.message}
                </small>
              )}
            </div>
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="img"
                className={`font-inter font-medium text-sm flex items-center gap-2 text-gray-500`}
              >
                {showUploadPhoto ? `Upload New Crop Image` : `Crop Image`}
                {showUploadPhoto ? (
                  <span
                    className={`bg-gray-400 px-3 py-1 rounded-2xl text-white cursor-pointer font-inter text-sm font-medium`}
                    onClick={() => {
                      if (dirtyFields.img) {
                        setValue("img", selectedCrop?.img);
                      }
                      setShowUploadPhoto(false);
                    }}
                  >
                    Discard photo
                  </span>
                ) : (
                  <span
                    className={`bg-gray-400 px-3 py-1 rounded-2xl text-white cursor-pointer font-inter text-sm font-medium`}
                    onClick={() => setShowUploadPhoto(true)}
                  >
                    Change photo
                  </span>
                )}
              </label>
              {showUploadPhoto ? (
                <Controller
                  name="img"
                  control={control}
                  render={({ field }) => (
                    <FileUpload
                      customUpload
                      name={field.name}
                      onSelect={(e) => field.onChange(e.files[0])}
                      accept="image/*"
                      maxFileSize={1000000}
                      emptyTemplate={
                        <p className="m-0">
                          Drag and drop files to here to upload.
                        </p>
                      }
                    />
                  )}
                />
              ) : imageSrc ? (
                <Image
                  preview
                  width={`200px`}
                  height={`200px`}
                  src={imageSrc}
                  alt="Crop image"
                  className={`max-w-[200px]`}
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.display = 'none';
                  }}
                />
              ) : (
                <div className={`flex items-center justify-center w-[200px] h-[200px] bg-gray-200 rounded`}>
                  <span className={`text-gray-500 text-sm`}>No image available</span>
                </div>
              )}
              {errors.img && (
                <small className="p-error">{errors.img.message}</small>
              )}
            </div>
            <div className={`flex gap-3 flex-col-reverse w-full md:flex-row`}>
              <Button
                type="button"
                disabled={updateCropsLoading}
                onClick={(e) => {
                  hide(e);
                  reset();
                }}
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