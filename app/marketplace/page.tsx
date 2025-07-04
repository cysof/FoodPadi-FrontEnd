import { Footer, Navbar } from "@/components";
import { FilterSection, Products } from "@/features/marketplace";
import React from "react";

const page = () => {
  return (
    <div className={`bg-white`}>
      <Navbar />
      <FilterSection />
      <Products />
      <Footer />
    </div>
  );
};

export default page;
