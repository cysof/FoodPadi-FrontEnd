// app/auth/forgot-password/page.tsx
import { ForgotPasswordForm } from "@/features/forgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}