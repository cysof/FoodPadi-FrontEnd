import { FetchAPI } from "@/store/FetchAPI";

const MarketCropIDApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getOneProduct: build.query<ICrop, GetACropInput>({
      query: ({ ...crop }) => ({
        url: `croplisting/crops/${crop.id}/`,
        method: "Get",
      }),
    }),
    createOrder: build.mutation<ICreateOrderResponse, IOrder>({
      query: ({ ...order }) => ({
        url: `order/orders/`,
        method: "post",
        body: order,
      }),
    }),
    initializePayment: build.mutation<IPaymentInitResponse, { order_id: number }>({
      query: ({ order_id }) => ({
        url: `payment/initialize/${order_id}/`,
        method: "post",
      }),
    }),
  }),
});

export const {
  useLazyGetOneProductQuery,
  useGetOneProductQuery,
  useCreateOrderMutation,
  useInitializePaymentMutation,
} = MarketCropIDApi;

export const { getOneProduct, createOrder, initializePayment } = MarketCropIDApi.endpoints;