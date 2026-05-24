// features/crops/components/Crops.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
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
import { Pagination } from "@/components";

const Crops = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);

  useEffect(() => {
    dispatch(setSearchTerm(debouncedValue));
    setCurrentPage(1);
  }, [debouncedValue, dispatch]);

  const crops = useAppSelector((state) => state.crops.crops);
  const getAllCropsError = useAppSelector(
    (state) => state.crops.getAllCropsError
  );
  const getAllCropsLoading = useAppSelector(
    (state) => state.crops.getAllCropsLoading
  );
  const search = useAppSelector((state) => state.crops.search);
  const count = useAppSelector((state) => state.crops.count);
  const next = useAppSelector((state) => state.crops.next);
  const previous = useAppSelector((state) => state.crops.previous);

  const query = {
    ...(search ? { search } : {}),
    page: currentPage,
  };

  useGetAllCropsQuery(query);

  useEffect(() => {
    if (getAllCropsError) {
      enqueueSnackbar(getAllCropsError, { variant: "error" });
      dispatch(clearCropsError());
    }
  }, [getAllCropsError, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fixed: Safely handle image with availability check
  const ImgTemplate = (value: ICrop) => (
    <Image
      src={
        value.availability?.toLowerCase() === "available" && value.img
          ? value.img
          : outofstock.src
      }
      preview
      width="150px"
      height="100px"
      alt={`${value.crop_name || 'Crop'} image`}
      className={`shrink-0`}
    />
  );

  // Fixed: Safely handle description with fallback
  const DescriptionTemplate = (value: ICrop) => (
    <div
      className={`text-black font-inter text-sm truncate max-w-[300px] w-full line-clamp-1`}
    >
      {value.crop_description || 'No description available'}
    </div>
  );

  // Fixed: Safely handle price formatting to prevent NaN
  const PriceTemplate = (value: ICrop) => {
    const price = Number(value.price_per_unit);
    const validPrice = !isNaN(price) && price > 0 ? price : 0;
    
    return (
      <div className={`text-black font-inter text-sm truncate w-full`}>
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(validPrice)}
        /{value.unit || 'unit'}
      </div>
    );
  };

  // Fixed: Safely handle date formatting
  const DateTemplate = (value: ICrop) => {
    if (!value.harvested_date) {
      return <div className={`text-black font-inter text-sm truncate w-full`}>Date not available</div>;
    }
    
    try {
      const date = new Date(value.harvested_date);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return <div className={`text-black font-inter text-sm truncate w-full`}>Invalid date</div>;
      }
      
      return (
        <div className={`text-black font-inter text-sm truncate w-full`}>
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(date)}
        </div>
      );
    } catch (error) {
      return <div className={`text-black font-inter text-sm truncate w-full`}>Date error</div>;
    }
  };

  // Fixed: Safely handle quantity display
  const QuantityTemplate = (value: ICrop) => (
    <div className={`text-black font-inter text-sm truncate w-full`}>
      {value.quantity !== undefined && value.quantity !== null ? value.quantity : 0}
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
              You don&apos;t have any crop yet
            </p>
          }
          className={`bg-white`}
        >
          <Column
            header={`Crop Image`}
            body={ImgTemplate}
            field="img"
            style={{ width: "25%" }}
          />
          <Column
            className={`capitalize`}
            field="crop_name"
            header="Crop Name"
            style={{ width: "20%" }}
          />
          <Column
            style={{ width: "25%" }}
            body={DescriptionTemplate}
            field="crop_description"
            header="Description"
          />
          <Column
            style={{ width: "10%" }}
            body={PriceTemplate}
            field="price_per_unit"
            header="Price per unit"
          />
          <Column
            style={{ width: "10%" }}
            body={QuantityTemplate}
            field="quantity"
            header="Quantity"
          />
          <Column
            style={{ width: "10%" }}
            body={DateTemplate}
            field="harvested_date"
            header="Date Harvested"
          />
          <Column
            style={{ width: "10%" }}
            header="Action"
            body={(e: ICrop) => <CropOverlayButton value={e} />}
          />
        </DataTable>
      </div>
      <Pagination
        count={count}
        next={next}
        previous={previous}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      <AddCropPop />
      <EditCropPop />
    </div>
  );
};

export default Crops;