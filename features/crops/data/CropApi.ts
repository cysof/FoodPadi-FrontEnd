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
    // ✅ Add image to crop
    addCropImage: build.mutation<ICropImage, { id: number; image: File }>({
      query: ({ id, image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return {
          url: `croplisting/crops/${id}/add-image/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["crops"],
    }),
    // ✅ Remove image from crop
    removeCropImage: build.mutation<void, { cropId: number; imageId: number }>({
      query: ({ cropId, imageId }) => ({
        url: `croplisting/crops/${cropId}/remove-image/${imageId}/`,
        method: "DELETE",
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
  useFlagAvailabilityMutation,
  useAddCropImageMutation,
  useRemoveCropImageMutation,
} = CropApi;

export const {
  createCrop,
  editACrop,
  getAllCrops,
  deleteACrop,
  logout,
  flagAvailability,
  addCropImage,
  removeCropImage,
} = CropApi.endpoints;

export default CropApi;