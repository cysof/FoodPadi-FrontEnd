"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import {
  clearCropsError,
  setSearchTerm,
  setShowCreateCropModal,
} from "../data/CropSlice";
import { enqueueSnackbar } from "notistack";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useGetAllCropsQuery } from "../data/CropApi";
import { Image } from "primereact/image";
import CropOverlayButton from "./CropOverlayButton";
import AddCropPop from "./AddCropPop";
import { useDebounce } from "primereact/hooks";
import { ConfirmDialog } from "primereact/confirmdialog";
import outofstock from "@/public/outofstock.png";
import EditCropPop from "./EditCropPop";

const Crops = () => {
  const dispatch = useAppDispatch();

  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);

  dispatch(setSearchTerm(debouncedValue));

  const crops = useAppSelector((state) => state.crops.crops);
  const getAllCropsError = useAppSelector(
    (state) => state.crops.getAllCropsError
  );
  const getAllCropsLoading = useAppSelector(
    (state) => state.crops.getAllCropsLoading
  );
  const search = useAppSelector((state) => state.crops.search);

  const query = {
    ...(search ? { search } : {}),
  };

  useGetAllCropsQuery(query);

  if (getAllCropsError) {
    enqueueSnackbar(getAllCropsError, { variant: "error" });
    dispatch(clearCropsError());
  }

  const ImgTemplate = (value: ICrop) => (
    <Image
      src={
        value.availability.toLowerCase() === "available"
          ? value.img
          : outofstock.src
      }
      preview
      width="150px"
      height="100px"
      alt={`${value.crop_name} image`}
      className={`shrink-0`}
    />
  );

  const DescriptionTemplate = (value: ICrop) => (
    <div
      className={`text-black font-inter text-sm truncate max-w-[300px] w-full line-clamp-1`}
    >
      {value.crop_description}
    </div>
  );

  const PriceTemplate = (value: ICrop) => (
    <div className={`text-black font-inter text-sm truncate w-full`}>
      {new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(Number(value.price_per_unit))}
      /{value.unit}
    </div>
  );

  const DateTemplate = (value: ICrop) => (
    <div className={`text-black font-inter text-sm truncate w-full`}>
      {new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value.harvested_date))}
    </div>
  );

  return (
    <div
      className={`bg-white overflow-y-scroll pb-10 w-full shrink h-full px-3`}
    >
      <ConfirmDialog className={`mx-2`} />
      <div
        className={`flex sm:justify-between md:items-center sm:flex-row flex-col w-full bg-white py-10 gap-3`}
      >
        <InputText
          placeholder="Search for a crop"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`sm:max-w-md w-full`}
          type="search"
        />
        <Button
          onClick={() => dispatch(setShowCreateCropModal(true))}
          className={`flex primary justify-center`}
        >
          Create a crop
        </Button>
      </div>
      <div className={`w-full shrink`}>
        <DataTable
          loading={getAllCropsLoading}
          value={crops}
          breakpoint="1300px"
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage={
            <p className={`text-center font-inter text-lg text-black`}>
              You don&apos;t have any crops yet
            </p>
          }
          className={`bg-white`}
        >
          <Column
            header={`Crop Image`}
            body={ImgTemplate}
            field="img"
            style={{ width: "25%" }}
          ></Column>
          <Column
            className={`capitalize`}
            field="crop_name"
            header="Crop Name"
            style={{ width: "20%" }}
          ></Column>
          <Column
            style={{ width: "25%" }}
            body={DescriptionTemplate}
            field="crop_description"
            header="Description"
          ></Column>
          <Column
            style={{ width: "10%" }}
            body={PriceTemplate}
            field="price_per_unit"
            header="Price per unit"
          ></Column>
          <Column
            style={{ width: "10%" }}
            field="quantity"
            header="Quantity"
          ></Column>
          <Column
            style={{ width: "10%" }}
            body={DateTemplate}
            field="harvested_date"
            header="Date Harvested"
          ></Column>
          <Column
            style={{ width: "10%" }}
            header="Action"
            body={(e: ICrop) => <CropOverlayButton value={e} />}
          ></Column>
        </DataTable>
      </div>
      <AddCropPop />
      <EditCropPop />
    </div>
  );
};

export default Crops;
