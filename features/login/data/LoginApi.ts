import { LoginAPI } from "@/store/LoginAPI";

const LoginApi = LoginAPI.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<ILoginResponse, ILoginForm>({
      query: ({ ...user }) => ({
        url: `accounts/api/login/`,
        method: "Post",
        body: user,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = LoginApi;
export const { loginUser } = LoginApi.endpoints;
