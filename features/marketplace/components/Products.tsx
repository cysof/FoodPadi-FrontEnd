// features/marketplace/components/Products.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useGetAllProductsQuery } from "../data/MarketApi";
import { useAppSelector } from "@/store/hooks";
import ProductCard from "./ProductCard";
import ProductsLoader from "./ProductsLoader";
import { Pagination, EmptyState } from "@/components";
import { Leaf } from "lucide-react";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const getAllProductsLoading = useAppSelector(
    (state) => state.market.getAllProductsLoading
  );
  const getAllProductsError = useAppSelector(
    (state) => state.market.getAllProductsError
  );
  const products = useAppSelector((state) => state.market.products);
  const search = useAppSelector((state) => state.market.search);
  const selectedCategory = useAppSelector((state) => state.market.selectedCategory);
  const inStockOnly = useAppSelector((state) => state.market.inStockOnly);
  const count = useAppSelector((state) => state.market.count);
  const next = useAppSelector((state) => state.market.next);
  const previous = useAppSelector((state) => state.market.previous);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, inStockOnly]);

  useGetAllProductsQuery({
    ...(search ? { search } : {}),
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(inStockOnly ? { availability: "AVAILABLE" } : {}),
    page: currentPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (getAllProductsLoading) return <ProductsLoader />;

  if (getAllProductsError) {
    return (
      <div className="w-full min-h-[400px] flex flex-col justify-center items-center gap-4 px-4">
        <p className="font-inter font-medium text-lg text-center text-gray-700">
          Error fetching marketplace products
        </p>
        <button
          onClick={() => window.location.reload()}
          className="font-inter text-sm border border-gray-300 py-2 px-6 rounded-lg text-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
        >
          Reload page
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 py-10">
        <EmptyState
          icon={Leaf}
          title={search ? "No Results Found" : "No Products Yet"}
          message={
            search
              ? `No crops found matching "${search}". Try a different search term.`
              : "No farm produce is listed in the marketplace yet. Check back soon!"
          }
          actionLabel={search ? "Clear Search" : undefined}
          onAction={search ? () => window.location.reload() : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-10 py-6">
      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-inter text-sm text-gray-500">
          <span className="text-gray-900 font-semibold">{count}</span>{" "}
          {count === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          count={count}
          next={next}
          previous={previous}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Products;
