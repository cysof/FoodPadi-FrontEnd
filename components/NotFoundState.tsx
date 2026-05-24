// components/NotFoundState.tsx
"use client";

import { ArrowLeft, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface NotFoundStateProps {
  title?: string;
  message?: string;
  backPath?: string;
  backLabel?: string;
}

const NotFoundState = ({
  title = "Not Found",
  message = "The item you are looking for does not exist or has been removed.",
  backPath,
  backLabel = "Go Back",
}: NotFoundStateProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-6 py-20`}
    >
      <div
        className={`flex flex-col items-center gap-4 max-w-md text-center`}
      >
        <div
          className={`h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center`}
        >
          <SearchX className={`text-primary`} width={40} height={40} />
        </div>
        <h3
          className={`font-square font-bold text-2xl text-primary-black`}
        >
          {title}
        </h3>
        <p className={`font-inter font-normal text-sm text-gray-500`}>
          {message}
        </p>
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-inter text-sm font-medium hover:bg-primary/90 transition-colors duration-200`}
        >
          <ArrowLeft width={16} height={16} />
          {backLabel}
        </button>
      </div>
    </div>
  );
};

export default NotFoundState;