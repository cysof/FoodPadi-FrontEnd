import { Navbar } from "@/components";
import { FilterSection, Products } from "@/features/marketplace";
import React from "react";

const page = () => {
  return (
    <div className={`relative bg-white`}>
      <Navbar />
      <FilterSection />
      <Products />
    </div>
  );
};

export default page;
