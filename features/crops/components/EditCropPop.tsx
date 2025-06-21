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
import { clearCropsError, setShowUpdateCropModal } from "../data/CropSlice";
import { useEditACropMutation } from "../data/CropApi";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";

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

  if (updateCropsError) {
    enqueueSnackbar(updateCropsError, { variant: "error" });
    dispatch(clearCropsError());
  }

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

  // const getChangedFieldsFromDirty = (): Partial<ICrop> => {
  //   const currentValues = getValues();
  //   const changed: Partial<ICrop> = {};

  //   Object.keys(dirtyFields).forEach((key) => {
  //     if (dirtyFields[key as keyof ICrop]) {
  //       changed[key as keyof ICrop] = currentValues[key as keyof ICropInput];
  //     }
  //   });

  //   return changed;
  // };

  const getChangedFieldsFromDirty = (): Partial<ICropInput> => {
    const currentValues = getValues();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changed: Record<string, any> = {};

    // dirtyFields contains boolean flags, not values
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
        <div className={`w-full bg-white `}>
          <h3
            className={`text-center capitalize font-Square font-semibold text-2xl text-black mb-4`}
          >
            Edit Crop
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-3`}
          >
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="title"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Title
              </label>
              <InputText {...register("crop_name")} />
              {errors.crop_name && (
                <small className="p-error">{errors.crop_name.message}</small>
              )}
            </div>
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="description"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Description
              </label>
              <InputTextarea
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
                htmlFor=""
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Date of harvest
              </label>
              <Controller
                name="harvested_date"
                control={control}
                render={({ field }) => (
                  <Calendar
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
                htmlFor="title"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Quantity
              </label>
              <InputText keyfilter={`num`} {...register("quantity")} />
              {errors.quantity && (
                <small className="p-error">{errors.quantity.message}</small>
              )}
            </div>
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="title"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Unit
              </label>
              <InputText {...register("unit")} />
              {errors.unit && (
                <small className="p-error">{errors.unit.message}</small>
              )}
            </div>
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="title"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Location
              </label>
              <InputText {...register("location")} />
              {errors.location && (
                <small className="p-error">{errors.location.message}</small>
              )}
            </div>
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="title"
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Price per Unit
              </label>
              <InputText keyfilter={`money`} {...register("price_per_unit")} />
              {errors.price_per_unit && (
                <small className="p-error">
                  {errors.price_per_unit.message}
                </small>
              )}
            </div>
            <div className={`flex flex-col gap-2`}>
              <label
                htmlFor="title"
                className={`font-inter flex items-center gap-2 font-medium text-sm text-gray-500`}
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
              ) : (
                <Image
                  preview
                  width={`200px`}
                  height={`200px`}
                  src={selectedCrop?.img}
                  alt="Crop image"
                  className={`max-w-[200]`}
                />
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
    ></Dialog>
  );
};

export default EditCropPop;
