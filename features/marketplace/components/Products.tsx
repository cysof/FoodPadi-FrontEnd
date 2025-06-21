"use client";

import React from "react";
import { useGetAllProductsQuery } from "../data/MarketApi";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import ProductsLoader from "./ProductsLoader";

const Products = () => {
  const router = useRouter();

  const getAllProductsLoading = useAppSelector(
    (state) => state.market.getAllProductsLoading
  );
  const getAllProductsError = useAppSelector(
    (state) => state.market.getAllProductsError
  );
  const products = useAppSelector((state) => state.market.products);
  const search = useAppSelector((state) => state.market.search);

  const query = {
    ...(search ? { search } : {}),
  };

  useGetAllProductsQuery(query);

  return getAllProductsLoading ? (
    <ProductsLoader />
  ) : getAllProductsError ? (
    <div
      className={`w-full h-svh flex flex-col justify-center items-center gap-3 max-w-7xl mx-auto bg-white`}
    >
      <p className={`font-inter font-medium text-lg text-center text-black`}>
        Error fetching Market products
      </p>
      <span
        className={`rounded-md border border-gray-300 py-2 px-5 text-black hover:bg-primary hover:text-white duration-300 transition-all cursor-pointer`}
        onClick={() => router.refresh()}
      >
        Click to reload your browser
      </span>
    </div>
  ) : products.length === 0 ? (
    <div
      className={`text-black text-lg font-inter h-svh w-full py-10 max-w-7xl`}
    >
      <p className={`text-center`}>No products yet in the market</p>
    </div>
  ) : (
    <div className={`min-h-svh py-10 px-3 md:px-10 max-w-7xl w-full mx-auto`}>
      <div
        className={`grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
