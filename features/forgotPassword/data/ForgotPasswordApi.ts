// features/forgotPassword/data/ForgotPasswordApi.ts
import { LoginAPI } from "@/store/LoginAPI";

const ForgotPasswordApi = LoginAPI.injectEndpoints({
  endpoints: (build) => ({
    forgotPassword: build.mutation<{ detail: string }, { email: string }>({
      query: (data) => ({
        url: `accounts/api/forgot-password/`,
        method: "Post",
        body: data,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation } = ForgotPasswordApi;