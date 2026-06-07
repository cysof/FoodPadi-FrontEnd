"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Button } from "primereact/button";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useAppSelector((state) => state.login.token.access);

  useEffect(() => {
    if (!reference) {
      router.push("/dashboard");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}payment/verify/${reference}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.payment_status === "PAID" || data.payment_status === "RELEASED") {
          setVerified(true);
        }
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <i className="pi pi-spin pi-spinner text-4xl text-primary" />
          <p className="font-inter text-gray-500">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white shadow-sm border border-gray-200 max-w-md w-full mx-4">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <i className="pi pi-check-circle text-5xl text-green-500" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-square font-bold text-2xl text-primary-black">
            Payment Successful!
          </h1>
          <p className="font-inter text-gray-500 text-sm">
            Your order has been placed and payment confirmed. The farmer will
            review and accept your order shortly.
          </p>
          {reference && (
            <p className="font-inter text-xs text-gray-400 mt-1">
              Reference: <span className="font-medium">{reference}</span>
            </p>
          )}
        </div>

        {/* What happens next */}
        <div className="w-full flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
          <h3 className="font-square font-medium text-sm text-primary-black">
            What happens next?
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { icon: "pi-check", text: "Payment held securely in escrow" },
              { icon: "pi-user", text: "Farmer reviews and accepts your order" },
              { icon: "pi-truck", text: "Transporter assigned for delivery" },
              { icon: "pi-star", text: "Funds released after delivery confirmed" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <i className={`pi ${item.icon} text-green-500 text-sm`} />
                <p className="font-inter text-xs text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/dashboard/orders" className="w-full">
            <Button
              label="View My Orders"
              icon="pi pi-list"
              className="primary w-full"
            />
          </Link>
          <Link href="/marketplace" className="w-full">
            <Button
              label="Continue Shopping"
              icon="pi pi-shopping-cart"
              className="p-button-outlined w-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;