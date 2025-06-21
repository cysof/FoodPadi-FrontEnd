"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { enqueueSnackbar } from "notistack";
import { clearCropsError, setShowCreateCropModal } from "../data/CropSlice";
import { useCreateCropMutation } from "../data/CropApi";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";

const AddCropPop = () => {
  const dispatch = useAppDispatch();

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

  if (createCropsError) {
    enqueueSnackbar(createCropsError, { variant: "error" });
    dispatch(clearCropsError());
  }

  const CropSchema = yup
    .object({
      crop_description: yup.string().required("Required"),
      crop_name: yup.string().required("Required"),
      harvested_date: yup.string().required("Required"),
      img: yup.mixed<File>().required("Required"),
      location: yup.string().required("Required"),
      price_per_unit: yup.number().required("Required"),
      quantity: yup.number().min(1).required("Required"),
      unit: yup.string().required("Required"),
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
    },
  });

  const onSubmit: SubmitHandler<ICropForm> = (data: ICropForm) => {
    const { harvested_date, img, ...restData } = data;
  
  const formData = new FormData();
  
  formData.append("img", img);
  
  Object.entries(restData).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  
  formData.append("harvested_date", new Date(harvested_date).toISOString().split("T")[0]);

    CreateCropMutation(formData)
      .unwrap()
      .then(() => {
        reset();
        dispatch(setShowCreateCropModal(false));
      });
  };

  return (
    <Dialog
      visible={showCreateCropModal}
      modal
      className={`mx-2 bg-white overflow-auto noScroll rounded-lg py-7 px-3 md:px-5 w-full max-w-[700px]`}
      onHide={() => dispatch(setShowCreateCropModal(false))}
      content={({ hide }) => (
        <div className={`w-full bg-white `}>
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
                className={`font-inter font-medium text-sm text-gray-500`}
              >
                Upload Crop Image
              </label>
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
              {/* <FileUpload
                {...register("img")}
                name="demo[]"
                url={"/api/upload"}
                multiple
                accept="image/*"
                maxFileSize={1000000}
                emptyTemplate={
                  <p className="m-0">Drag and drop files to here to upload.</p>
                }
              /> */}
              {errors.img && (
                <small className="p-error">{errors.img.message}</small>
              )}
            </div>
            <div className={`flex gap-3 flex-col-reverse w-full md:flex-row`}>
              <Button
                type="button"
                disabled={createCropsLoading}
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
                loading={createCropsLoading}
                className={`flex flex-row-reverse gap-2 justify-center primary w-full items-center font-square font-medium text-sm`}
              >
                Post Crop
              </Button>
            </div>
          </form>
        </div>
      )}
    ></Dialog>
  );
};

export default AddCropPop;
