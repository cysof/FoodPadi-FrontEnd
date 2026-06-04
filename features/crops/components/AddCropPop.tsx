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

const AddCropPop = () => {
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  const CropSchema = yup
    .object({
      crop_description: yup.string().required("Description is required"),
      crop_name: yup.string().required("Title is required"),
      harvested_date: yup.string().required("Harvest date is required"),
      img: yup.mixed<File>().required("Image is required"),
      location: yup.string().required("Location is required"),
      price_per_unit: yup.number().typeError("Price must be a number").required("Price per unit is required").positive("Price must be positive"),
      quantity: yup.number().typeError("Quantity must be a number").min(1, "Quantity must be at least 1").required("Quantity is required"),
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
      img: undefined,
      location: "",
      price_per_unit: 0,
      quantity: 0,
      unit: "",
      availability: "",
    },
  });

  const onSubmit: SubmitHandler<ICropForm> = (data: ICropForm) => {
    const { harvested_date, img, ...restData } = data;

    const formData = new FormData();
    formData.append("img", img);
    Object.entries(restData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append(
      "harvested_date",
      new Date(harvested_date).toISOString().split("T")[0]
    );

    CreateCropMutation(formData)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Crop created successfully", { variant: "success" });
        reset();
        setSelectedImage(null);
        dispatch(setShowCreateCropModal(false));
      })
      .catch((error) => {
        enqueueSnackbar(error?.data?.detail || "Failed to create crop", { variant: "error" });
      });
  };

  return (
    <Dialog
      visible={showCreateCropModal}
      modal
      className={`mx-2 bg-white overflow-auto noScroll rounded-lg py-7 px-3 md:px-5 w-full max-w-[700px]`}
      onHide={() => dispatch(setShowCreateCropModal(false))}
      content={({ hide }) => (
        <div className={`w-full bg-white`}>
          <h3
            className={`text-center capitalize font-Square font-semibold text-2xl text-black mb-4`}
          >
            Add New Crop
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-3`}
          >
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="crop_name" className={`font-inter font-medium text-sm text-gray-500`}>
                Title
              </label>
              <InputText id="crop_name" {...register("crop_name")} />
              {errors.crop_name && (
                <small className="p-error">{errors.crop_name.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="crop_description" className={`font-inter font-medium text-sm text-gray-500`}>
                Description
              </label>
              <InputTextarea
                id="crop_description"
                className={`resize-none`}
                {...register("crop_description")}
              />
              {errors.crop_description && (
                <small className="p-error">{errors.crop_description.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2 w-full`}>
              <label htmlFor="harvested_date" className={`font-inter font-medium text-sm text-gray-500`}>
                Date of Harvest
              </label>
              <Controller
                name="harvested_date"
                control={control}
                render={({ field }) => (
                  <div className={`flex flex-col gap-1`}>
                    <Calendar
                      inputId="harvested_date"
                      dateFormat={`yy-mm-dd`}
                      minDate={undefined}
                      value={
                        field.value !== "" ? new Date(field.value) : null
                      }
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.value)}
                      showIcon
                      iconPos="left"
                      aria-label="Select harvest date"
                    />
                    {field.value && (
                      <small className="text-gray-600">
                        Selected: {new Date(field.value).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                )}
              />
              {errors.harvested_date && (
                <small className="p-error">{errors.harvested_date.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="quantity" className={`font-inter font-medium text-sm text-gray-500`}>
                Quantity
              </label>
              <InputText 
                id="quantity" 
                type="number" 
                min="1"
                {...register("quantity")} 
                aria-label="Quantity"
              />
              {errors.quantity && (
                <small className="p-error">{errors.quantity.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="unit" className={`font-inter font-medium text-sm text-gray-500`}>
                Unit
              </label>
              <InputText id="unit" {...register("unit")} />
              {errors.unit && (
                <small className="p-error">{errors.unit.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="location" className={`font-inter font-medium text-sm text-gray-500`}>
                Location
              </label>
              <InputText id="location" {...register("location")} />
              {errors.location && (
                <small className="p-error">{errors.location.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="price_per_unit" className={`font-inter font-medium text-sm text-gray-500`}>
                Price per Unit
              </label>
              <InputText 
                id="price_per_unit" 
                type="number" 
                step="0.01"
                min="0"
                {...register("price_per_unit")} 
                aria-label="Price per unit"
              />
              {errors.price_per_unit && (
                <small className="p-error">{errors.price_per_unit.message}</small>
              )}
            </div>

            {/* Availability Field */}
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="availability" className={`font-inter font-medium text-sm text-gray-500`}>
                Availability
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
                      { label: "Out of Stock", value: "OUT OF STOCK" }
                    ]}
                    placeholder="Select availability"
                    className="w-full"
                    aria-label="Availability status"
                  />
                )}
              />
              {errors.availability && (
                <small className="p-error">{errors.availability.message}</small>
              )}
            </div>
            
            <div className={`flex flex-col gap-2`}>
              <label htmlFor="img" className={`font-inter font-medium text-sm text-gray-500`}>
                Upload Crop Image
              </label>
              <Controller
                name="img"
                control={control}
                render={({ field }) => (
                  <div className={`flex flex-col gap-2`}>
                    <FileUpload
                      customUpload
                      name={field.name}
                      onSelect={(e) => {
                        field.onChange(e.files[0]);
                        setSelectedImage(e.files[0]);
                      }}
                      accept="image/*"
                      maxFileSize={5000000}
                      emptyTemplate={
                        <p className="m-0">
                          Drag and drop files here to upload.
                        </p>
                      }
                    />
                    {selectedImage && (
                      <div className={`flex flex-col gap-2`}>
                        <p className="text-sm font-medium text-gray-600">
                          Selected: {selectedImage.name}
                        </p>
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Preview"
                          className={`w-full max-h-48 object-cover rounded border border-gray-300`}
                        />
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.img && (
                <small className="p-error">{errors.img.message}</small>
              )}
            </div>
            
            <div className={`flex gap-3 flex-col-reverse w-full md:flex-row`}>
              <Button
                type="button"
                disabled={createCropsLoading}
                onClick={(e) => {
                  e.preventDefault();
                  reset();
                  setSelectedImage(null);
                  dispatch(setShowCreateCropModal(false));
                }}
                outlined
                severity="danger"
                className={`flex justify-center w-full items-center font-square font-medium text-sm`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createCropsLoading}
                className={`flex flex-row-reverse gap-2 justify-center primary w-full items-center font-square font-medium text-sm`}
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