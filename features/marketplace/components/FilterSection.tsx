"use client";

import { InputText } from "primereact/inputtext";
import React from "react";
import { useDebounce } from "primereact/hooks";
import { useAppDispatch } from "@/store/hooks";
import { setSearchTerm } from "../data/MarketPlaceSlice";

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);
  
  dispatch(setSearchTerm(debouncedValue));

  return (
    <div className={`max-w-7xl px-3 md:px-10 py-10 w-full mx-auto`}>
      <div>
        <InputText
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full"
          type="search"
          placeholder="search a crop"
        />
      </div>
    </div>
  );
};

export default FilterSection;
