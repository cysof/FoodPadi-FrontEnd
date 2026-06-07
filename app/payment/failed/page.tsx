"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import Link from "next/link";

const PaymentFailedPage = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white shadow-sm border border-gray-200 max-w-md w-full mx-4">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <i className="pi pi-times-circle text-5xl text-red-500" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-square font-bold text-2xl text-primary-black">
            Payment Failed
          </h1>
          <p className="font-inter text-gray-500 text-sm">
            Your payment could not be processed. No money has been deducted
            from your account. Please try again.
          </p>
          {reference && (
            <p className="font-inter text-xs text-gray-400 mt-1">
              Reference: <span className="font-medium">{reference}</span>
            </p>
          )}
        </div>

        {/* Possible reasons */}
        <div className="w-full flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
          <h3 className="font-square font-medium text-sm text-primary-black">
            Possible reasons
          </h3>
          <div className="flex flex-col gap-2">
            {[
              "Insufficient funds in your account",
              "Card declined by your bank",
              "Payment session timed out",
              "Network error during payment",
            ].map((reason, i) => (
              <div key={i} className="flex items-center gap-2">
                <i className="pi pi-info-circle text-red-400 text-sm" />
                <p className="font-inter text-xs text-gray-500">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            label="Try Again"
            icon="pi pi-refresh"
            className="primary w-full"
            onClick={() => router.back()}
          />
          <Link href="/dashboard/orders" className="w-full">
            <Button
              label="View My Orders"
              icon="pi pi-list"
              className="p-button-outlined w-full"
            />
          </Link>
        </div>

        {/* Support */}
        <p className="font-inter text-xs text-gray-400 text-center">
          Need help?{" "}
          <a href="mailto:support@foodpadi.com" className="text-primary underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailedPage;