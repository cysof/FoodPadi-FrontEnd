// features/account/data/AccountApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const AccountApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    // Get user profile
    getProfile: build.query<IUser, void>({
      query: () => ({
        url: `accounts/profile/`,
        method: "Get",
      }),
      providesTags: ["profile"],
    }),

    // Update user profile
    updateProfile: build.mutation<IUpdateProfileResponse, IUpdateProfileForm>({
      query: (data) => ({
        url: `accounts/profile/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    // Change password
    changePassword: build.mutation<IChangePasswordResponse, IChangePasswordInput>({
      query: (data) => ({
        url: `accounts/change-password/`,
        method: "Post",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = AccountApi;

export const { getProfile, updateProfile, changePassword } =
  AccountApi.endpoints;