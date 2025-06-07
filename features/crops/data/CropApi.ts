import { FetchAPI } from "@/store/FetchAPI";

const CropApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, void>({
      query: () => ({
        url: `accounts/api/logout/`,
        method: "Post",
      }),
    }),

    // create a crop
    createCrop: build.mutation<void, ICropForm>({
      query: (crop) => ({
        url: `croplistingcrop-listings/`,
        method: "Post",
        body: crop,
      }),
      invalidatesTags: ["crops"],
    }),

    // get all crops
    getAllCrops: build.query<ILoginResponse, ILoginForm>({
      query: ({ ...user }) => ({
        url: `croplistingcrop-listings/`,
        method: "Get",
        body: user,
      }),
      providesTags: ["crops"],
    }),

    // edit a crop
    editACrop: build.mutation<ILoginResponse, ILoginForm>({
      query: ({ ...user }) => ({
        url: `croplistingcrop-listings/`,
        method: "Post",
        body: user,
      }),
      invalidatesTags: ["crops"],
    }),

    // delete a crop
    deleteACrop: build.mutation<ILoginResponse, ILoginForm>({
      query: ({ ...crop }) => ({
        url: `croplistingcrop-listings/${crop}`, // add an id here
        method: "Delete",
      }),
      invalidatesTags: ["crops"],
    }),
  }),
});

export const {
  useCreateCropMutation,
  useDeleteACropMutation,
  useGetAllCropsQuery,
  useEditACropMutation,
  useLogoutMutation
} = CropApi;
export const { createCrop, deleteACrop, editACrop, getAllCrops, logout } =
  CropApi.endpoints;
