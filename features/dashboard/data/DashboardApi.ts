// features/dashboard/data/DashboardApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const DashboardApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getFarmerDashboard: build.query<IFarmerDashboard, void>({
      query: () => ({
        url: `farmer/dashboard/`,
        method: "GET",
      }),
    }),
    getBuyerDashboard: build.query<IBuyerDashboard, void>({
      query: () => ({
        url: `buyer/dashboard/`,
        method: "GET",
      }),
    }),
    getTransporterDashboard: build.query<ITransporterDashboard, void>({
      query: () => ({
        url: `transporter/dashboard/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetFarmerDashboardQuery,
  useGetBuyerDashboardQuery,
  useGetTransporterDashboardQuery,
} = DashboardApi;

export const {
  getFarmerDashboard,
  getBuyerDashboard,
  getTransporterDashboard,
} = DashboardApi.endpoints;