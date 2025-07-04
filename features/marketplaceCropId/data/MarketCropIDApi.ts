import { FetchAPI } from "@/store/FetchAPI";

const MarketCropIDApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getOneProduct: build.query<ICrop, GetACropInput>({
      query: ({ ...crop }) => ({
        url: `croplisting/api/crops/${crop.id}`,
        method: "Get",
      }),
    }),

    createOrder: build.mutation<void, IOrder>({
      query: ({ ...order }) => ({
        url: `order/orders/`,
        method: "post",
        body: order
      }),
    }),
  }),
});

export const { useLazyGetOneProductQuery, useCreateOrderMutation } = MarketCropIDApi;
export const { getOneProduct, createOrder } = MarketCropIDApi.endpoints;
