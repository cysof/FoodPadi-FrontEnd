// components/EmptyState.tsx
"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const EmptyState = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center gap-4 py-20`}
    >
      <div
        className={`h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center`}
      >
        <Icon className={`text-primary`} width={40} height={40} />
      </div>
      <div className={`flex flex-col items-center gap-2 text-center max-w-sm`}>
        <h3 className={`font-square font-bold text-xl text-primary-black`}>
          {title}
        </h3>
        <p className={`font-inter font-normal text-sm text-gray-500`}>
          {message}
        </p>
      </div>
      {actionLabel && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className={`bg-primary text-white px-6 py-2 rounded-full font-inter text-sm font-medium hover:bg-primary/90 transition-colors duration-200`}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className={`bg-primary text-white px-6 py-2 rounded-full font-inter text-sm font-medium hover:bg-primary/90 transition-colors duration-200`}
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyState;