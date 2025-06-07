import { LoginAPI } from "@/store/LoginAPI";

const RegisterApi = LoginAPI.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<void, IRegisterForm>({
      query: ({ ...user }) => ({
        url: `accounts/api/register/`,
        method: "Post",
        body: user,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = RegisterApi;
export const { registerUser } = RegisterApi.endpoints;
