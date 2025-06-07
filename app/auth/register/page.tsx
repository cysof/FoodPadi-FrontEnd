import { AuthWrapper } from "@/components";
import { AccountForm } from "@/features/register";
import React from "react";

const RegisterPage = () => {
  return (
    <AuthWrapper>
      <AccountForm />
    </AuthWrapper>
  );
};

export default RegisterPage;
