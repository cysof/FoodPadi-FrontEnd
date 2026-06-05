// features/crops/data/CropApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const CropApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, void>({
      query: () => ({
        url: `accounts/logout/`,
        method: "POST",
      }),
    }),

    createCrop: build.mutation<any, FormData>({
      query: (formData) => ({
        url: `croplisting/crops/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["crops"],
    }),

    getAllCrops: build.query<IGetMarketProduceResponse, searchTerm>({
      query: ({ ...terms }) => ({
        url: `croplisting/crops/my-listings/`,
        method: "GET",
        params: terms,
      }),
      providesTags: ["crops"],
    }),

    editACrop: build.mutation<any, { form: FormData; id: number }>({
      query: ({ form, id }) => ({
        url: `croplisting/crops/${id}/`,
        method: "PATCH",
        body: form,
      }),
      invalidatesTags: ["crops"],
    }),

    flagAvailability: build.mutation<void, { id: number; availability: string }>({
      query: ({ id, availability }) => ({
        url: `croplisting/crops/${id}/`,
        method: "PATCH",
        body: { availability },
      }),
      invalidatesTags: ["crops"],
    }),

    deleteACrop: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `croplisting/crops/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["crops"],
    }),
  }),
});

// Export hooks for use in components
export const {
  useCreateCropMutation,
  useDeleteACropMutation,
  useGetAllCropsQuery,
  useEditACropMutation,
  useLogoutMutation,
  useFlagAvailabilityMutation
} = CropApi;

// Export endpoint objects for use in slices or other places if needed
export const { 
  createCrop, 
  editACrop, 
  getAllCrops, 
  deleteACrop, 
  logout, 
  flagAvailability 
} = CropApi.endpoints;

export default CropApi;