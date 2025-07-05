import { FetchAPI } from "@/store/FetchAPI";

const OrderApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    // get all orders
    getAllOrders: build.query<IOrderResponse, IOrderInput>({
      query: ({ ...order }) => ({
        url: `order/orders/`,
        method: "get",
        params: order,
      }),
      providesTags: ["orders"],
    }),

    // // get all crops
    // getAllCrops: build.query<IGetMarketProduceResponse, searchTerm>({
    //   query: ({ ...terms }) => ({
    //     url: `croplisting/api/crops/my-listings/`,
    //     method: "Get",
    //     params: terms,
    //   }),
    //   providesTags: ["crops"],
    // }),

    // // edit a crop
    // editACrop: build.mutation<void, ICropFormUpdate>({
    //   query: ({ ...crop }) => ({
    //     url: `croplisting/api/crops/${crop.id}/`,
    //     method: "PATCH",
    //     body: crop.form,
    //   }),
    //   invalidatesTags: ["crops"],
    // }),

    // // Change the availability of a product
    // flagAvailability: build.mutation<void, IChangeAvailability>({
    //   query: ({ ...crop }) => ({
    //     url: `croplisting/api/crops/${crop.id}/`,
    //     method: "PATCH",
    //     body: { availability: crop.availability },
    //   }),
    //   invalidatesTags: ["crops"],
    // }),

    // // delete a crop
    // deleteACrop: build.mutation<void, ICropInputID>({
    //   query: ({ ...crop }) => ({
    //     url: `croplisting/api/crops/${crop.id}/`, // add an id here
    //     method: "Delete",
    //   }),
    //   invalidatesTags: ["crops"],
    // }),
  }),
});

export const { useGetAllOrdersQuery } = OrderApi;
export const { getAllOrders } = OrderApi.endpoints;
