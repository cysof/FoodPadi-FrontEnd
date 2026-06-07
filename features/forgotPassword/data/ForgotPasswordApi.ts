// features/forgotPassword/data/ForgotPasswordApi.ts
import { LoginAPI } from "@/store/LoginAPI";

interface IForgotPasswordInput {
  email: string;
}

interface IConfirmPasswordResetInput {
  token: string;
  new_password: string;
  confirm_password: string;
}

interface IPasswordResetResponse {
  detail: string;
}

const ForgotPasswordApi = LoginAPI.injectEndpoints({
  endpoints: (build) => ({
    forgotPassword: build.mutation<IPasswordResetResponse, IForgotPasswordInput>({
      query: (data) => ({
        url: `accounts/password-reset/`,
        method: "POST",
        body: data,
      }),
    }),
    confirmPasswordReset: build.mutation<IPasswordResetResponse, IConfirmPasswordResetInput>({
      query: (data) => ({
        url: `accounts/password-reset/confirm/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useConfirmPasswordResetMutation,
} = ForgotPasswordApi;