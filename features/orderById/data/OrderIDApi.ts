// features/orderById/data/OrderIDApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const OrderIDApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    // Get one order
    getOneOrder: build.query<IOrderData, IGetOrderInput>({
      query: ({ ...order }) => ({
        url: `order/orders/${order.id}/`,
        method: "Get",
      }),
      providesTags: ["orders"],
    }),

    // Accept an order
    acceptOrder: build.mutation<IOrderActionResponse, IGetOrderInput>({
      query: ({ id }) => ({
        url: `order/orders/${id}/accept_order/`,
        method: "Post",
      }),
      invalidatesTags: ["orders"],
    }),

    // Cancel an order
    cancelOrder: build.mutation<IOrderActionResponse, ICancelOrderInput>({
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
  useGetOneOrderQuery,
  useAcceptOrderMutation,
  useCancelOrderMutation,
} = OrderIDApi;

export const { getOneOrder, acceptOrder, cancelOrder } = OrderIDApi.endpoints;