import { FetchAPI } from "@/store/FetchAPI";

const OrderIDApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getOneOrder: build.query<IOrderData, IGetOrderInput>({
      query: ({ ...order }) => ({
        url: `order/orders/${order.id}`,
        method: "Get",
      }),
    }),
  }),
});

export const { useGetOneOrderQuery } = OrderIDApi;
export const { getOneOrder } = OrderIDApi.endpoints;
