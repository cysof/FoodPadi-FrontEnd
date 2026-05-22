// features/order/data/BuyerOrderApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const BuyerOrderApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    // Get all buyer orders
    getAllBuyerOrders: build.query<IBuyerOrderResponse, IBuyerOrderInput>({
      query: ({ ...params }) => ({
        url: `buyer/orders/history/`,
        method: "Get",
        params,
      }),
      providesTags: ["orders"],
    }),

    // Cancel a buyer order
    cancelBuyerOrder: build.mutation<IOrderActionResponse, ICancelOrderInput>({
      query: ({ id, reason }) => ({
        url: `order/orders/${id}/cancel_order/`,
        method: "Post",
        body: { reason },
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useGetAllBuyerOrdersQuery,
  useCancelBuyerOrderMutation,
} = BuyerOrderApi;

export const { getAllBuyerOrders, cancelBuyerOrder } =
  BuyerOrderApi.endpoints;