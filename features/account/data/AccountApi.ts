// features/account/data/AccountApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const AccountApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    // Get user profile
    getProfile: build.query<IUser, void>({
      query: () => ({
        url: `accounts/api/profile/`,
        method: "Get",
      }),
      providesTags: ["profile"],
    }),

    // Update user profile
    updateProfile: build.mutation<IUpdateProfileResponse, IUpdateProfileForm>({
      query: (data) => ({
        url: `accounts/api/profile/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    // Change password
    changePassword: build.mutation<IChangePasswordResponse, IChangePasswordInput>({
      query: (data) => ({
        url: `accounts/api/change-password/`,
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