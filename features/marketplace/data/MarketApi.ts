import { FetchAPI } from "@/store/FetchAPI";

const MarketApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query<IGetMarketProduceResponse, searchTerm>({
      query: ({ ...terms }) => ({
        url: `croplisting/api/crops/`,
        method: "Get",
        params: terms,
      }),
    }),
  }),
});

export const { useGetAllProductsQuery } = MarketApi;
export const { getAllProducts } = MarketApi.endpoints;
