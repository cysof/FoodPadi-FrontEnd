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
    getCategories: build.query<ICategory[], void>({
      query: () => ({
        url: `croplisting/categories/`,
        method: "GET",
      }),
      transformResponse: (response: IGetCategoriesResponse) => response.results,
    }),
    getUnits: build.query<IUnit[], void>({
      query: () => ({
        url: `croplisting/units/`,
        method: "GET",
      }),
      transformResponse: (response: IGetUnitsResponse) => response.results,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetCategoriesQuery,
  useGetUnitsQuery,
} = MarketApi;
export const { getAllProducts, getCategories, getUnits } = MarketApi.endpoints;
export default MarketApi;
