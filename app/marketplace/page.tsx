import { Footer, Navbar } from "@/components";
import { FilterSection, Products } from "@/features/marketplace";
import React from "react";

const page = () => {
  return (
    <div className="bg-gray-50 pt-16">
      <Navbar />
      <FilterSection />
      <Products />
      <Footer />
    </div>
  );
};

export default page;