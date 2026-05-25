// features/transporter/data/TransporterApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const TransporterApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllDeliveries: build.query<ITransporterDashboardResponse, ITransporterDeliveryInput>({
      query: (params) => ({
        url: `transporter/transporter-dashboard/`,
        method: "Get",
        params,
      }),
      providesTags: ["deliveries"],
    }),
    getOneDelivery: build.query<ITransporterDelivery, { id: number }>({
      query: ({ id }) => ({
        url: `delivery/deliveries/${id}/`,
        method: "Get",
      }),
      providesTags: ["deliveries"],
    }),
    acceptDelivery: build.mutation<IDeliveryActionResponse, { id: number }>({
      query: ({ id }) => ({
        url: `delivery/deliveries/${id}/accept/`,
        method: "Post",
      }),
      invalidatesTags: ["deliveries"],
    }),
    startDelivery: build.mutation<IDeliveryActionResponse, { id: number }>({
      query: ({ id }) => ({
        url: `delivery/deliveries/${id}/start/`,
        method: "Post",
      }),
      invalidatesTags: ["deliveries"],
    }),
    completeDelivery: build.mutation<IDeliveryActionResponse, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `delivery/deliveries/${id}/complete/`,
        method: "Post",
        body: formData,
      }),
      invalidatesTags: ["deliveries"],
    }),
    cancelDelivery: build.mutation<IDeliveryActionResponse, ICancelDeliveryInput>({
      query: ({ id, reason }) => ({
        url: `delivery/deliveries/${id}/cancel/`,
        method: "Post",
        body: { reason },
      }),
      invalidatesTags: ["deliveries"],
    }),
    rejectDelivery: build.mutation<IDeliveryActionResponse, { id: number }>({
      query: ({ id }) => ({
        url: `delivery/deliveries/${id}/reject/`,
        method: "Post",
      }),
      invalidatesTags: ["deliveries"],
    }),
  }),
});

export const {
  useGetAllDeliveriesQuery,
  useGetOneDeliveryQuery,
  useAcceptDeliveryMutation,
  useStartDeliveryMutation,
  useCompleteDeliveryMutation,
  useCancelDeliveryMutation,
  useRejectDeliveryMutation,
} = TransporterApi;

export const {
  getAllDeliveries,
  getOneDelivery,
  acceptDelivery,
  startDelivery,
  completeDelivery,
  cancelDelivery,
  rejectDelivery,
} = TransporterApi.endpoints;
