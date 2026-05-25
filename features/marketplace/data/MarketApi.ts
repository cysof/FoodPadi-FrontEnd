// features/marketplace/data/MarketApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const MarketApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllProducts: build.query<IGetMarketProduceResponse, searchTerm>({
      query: (params) => ({
        url: `croplisting/crops/`,
        method: "Get",
        params,
      }),
    }),
  }),
});

export const { useGetAllProductsQuery } = MarketApi;
export const { getAllProducts } = MarketApi.endpoints;