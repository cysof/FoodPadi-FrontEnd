"use client";

import { Search } from "lucide-react";
import React, { useEffect } from "react";
import { useDebounce } from "primereact/hooks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchTerm, setSelectedCategory, setInStockOnly } from "../data/MarketPlaceSlice";
import { useGetCategoriesQuery } from "../data/MarketApi";

const FilterSection = () => {
  const dispatch = useAppDispatch();
  const [inputValue, debouncedValue, setInputValue] = useDebounce("", 400);

  const selectedCategory = useAppSelector((state) => state.market.selectedCategory);
  const inStockOnly = useAppSelector((state) => state.market.inStockOnly);
  const { data: categories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    dispatch(setSearchTerm(debouncedValue));
  }, [debouncedValue]);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-green-900 to-green-700 py-10 px-4 text-center">
        <span className="inline-block bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-medium px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          🛒 Fresh from the farm
        </span>
        <h1 className="font-inter font-bold text-2xl md:text-3xl text-white mb-2">
          Browse the Marketplace
        </h1>
        <p className="text-white/70 text-sm mb-6 font-inter">
          Fresh produce and livestock from verified Nigerian farmers
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="search"
            placeholder="Search for crops, livestock..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none outline-none font-inter text-sm text-gray-800 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => dispatch(setSelectedCategory(null))}
          className={`flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 font-inter ${
            selectedCategory === null
              ? "bg-green-800 border-green-800 text-white"
              : "bg-white border-gray-200 text-gray-600 hover:border-green-700 hover:text-green-700"
          }`}
        >
          All Products
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => dispatch(setSelectedCategory(category.id))}
            className={`flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 font-inter ${
              selectedCategory === category.id
                ? "bg-green-800 border-green-800 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-green-700 hover:text-green-700"
            }`}
          >
            {category.name}
          </button>
        ))}

        <button
          onClick={() => dispatch(setInStockOnly(!inStockOnly))}
          className={`flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 font-inter ${
            inStockOnly
              ? "bg-green-800 border-green-800 text-white"
              : "bg-white border-gray-200 text-gray-600 hover:border-green-700 hover:text-green-700"
          }`}
        >
          ✅ In Stock
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
