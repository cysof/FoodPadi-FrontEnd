import { AuthWrapper } from "@/components";
import { LoginForm } from "@/features/login";
import React from "react";

const LoginPage = () => {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
};

export default LoginPage;
