// features/marketplace/components/Products.tsx
"use client";

import React, { useState } from "react";
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
  const count = useAppSelector((state) => state.market.count);
  const next = useAppSelector((state) => state.market.next);
  const previous = useAppSelector((state) => state.market.previous);

  const query = {
    ...(search ? { search } : {}),
    page: currentPage,
  };

  useGetAllProductsQuery(query);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (getAllProductsLoading) {
    return <ProductsLoader />;
  }

  if (getAllProductsError) {
    return (
      <div
        className={`w-full h-svh flex flex-col justify-center items-center gap-3 max-w-7xl mx-auto bg-white`}
      >
        <p
          className={`font-inter font-medium text-lg text-center text-black`}
        >
          Error fetching Market products
        </p>
        <span
          className={`rounded-md border border-gray-300 py-2 px-5 text-black hover:bg-primary hover:text-white duration-300 transition-all cursor-pointer`}
          onClick={() => window.location.reload()}
        >
          Click to reload your browser
        </span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`max-w-7xl w-full mx-auto`}>
        <EmptyState
          icon={Leaf}
          title={search ? "No Results Found" : "No Products Yet"}
          message={
            search
              ? `No crops found matching "${search}". Try a different search term.`
              : "No farm produce is listed in the marketplace yet. Check back soon!"
          }
          actionLabel={search ? "Clear Search" : undefined}
          onAction={
            search ? () => window.location.reload() : undefined
          }
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-svh py-10 px-3 md:px-10 max-w-7xl w-full mx-auto`}
    >
      <div
        className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        count={count}
        next={next}
        previous={previous}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Products;