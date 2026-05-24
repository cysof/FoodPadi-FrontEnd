// components/NotFoundPage.tsx
"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NotFoundPageProps {
  title?: string;
  message?: string;
}

const NotFoundPage = ({
  title = "Page Not Found",
  message = "The page you are looking for does not exist or has been removed.",
}: NotFoundPageProps) => {
  return (
    <div
      className={`w-full h-dvh bg-white flex flex-col items-center justify-center gap-6 px-3`}
    >
      <div
        className={`flex flex-col items-center gap-4 max-w-md text-center`}
      >
        {/* Icon */}
        <div
          className={`h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center`}
        >
          <SearchX className={`text-primary`} width={48} height={48} />
        </div>

        {/* 404 */}
        <h1
          className={`font-square font-bold text-8xl text-primary`}
        >
          404
        </h1>

        {/* Title */}
        <h3
          className={`font-square font-bold text-2xl text-primary-black`}
        >
          {title}
        </h3>

        {/* Message */}
        <p className={`font-inter font-normal text-sm text-gray-500`}>
          {message}
        </p>

        {/* Actions */}
        <div className={`flex items-center gap-3`}>
          <Link
            href={`/`}
            className={`flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-inter text-sm font-medium hover:bg-primary/90 transition-colors duration-200`}
          >
            Go Home
          </Link>
          <Link
            href={`/marketplace`}
            className={`flex items-center gap-2 border border-primary text-primary px-6 py-2 rounded-full font-inter text-sm font-medium hover:bg-primary/10 transition-colors duration-200`}
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;