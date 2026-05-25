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
    createCrop: build.mutation<void, FormData>({
      query: (crop) => ({
        url: `croplisting/crops/`,  // ✅ Removed /api/ from the middle
        method: "Post",
        body: crop,
      }),
      invalidatesTags: ["crops"],
    }),

    // get all crops
    getAllCrops: build.query<IGetMarketProduceResponse, searchTerm>({
      query: ({ ...terms }) => ({
        url: `croplisting/crops/my-listings/`,  // ✅ Removed /api/ from the middle
        method: "Get",
        params: terms,
      }),
      providesTags: ["crops"],
    }),

    // edit a crop
    editACrop: build.mutation<void, ICropFormUpdate>({
      query: ({ ...crop }) => ({
        url: `croplisting/crops/${crop.id}/`,  // ✅ Removed /api/ from the middle
        method: "PATCH",
        body: crop.form,
      }),
      invalidatesTags: ["crops"],
    }),

    // Change the availability of a product
    flagAvailability: build.mutation<void, IChangeAvailability>({
      query: ({ ...crop }) => ({
        url: `croplisting/crops/${crop.id}/`,  // ✅ Removed /api/ from the middle
        method: "PATCH",
        body: { availability: crop.availability },
      }),
      invalidatesTags: ["crops"],
    }),

    // delete a crop
    deleteACrop: build.mutation<void, ICropInputID>({
      query: ({ ...crop }) => ({
        url: `croplisting/crops/${crop.id}/`,  // ✅ Removed /api/ from the middle
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
  useLogoutMutation,
  useFlagAvailabilityMutation
} = CropApi;
export const { createCrop, deleteACrop, editACrop, getAllCrops, logout, flagAvailability } =
  CropApi.endpoints;