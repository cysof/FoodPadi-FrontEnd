// features/dashboard/data/DashboardApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const DashboardApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getFarmerDashboard: build.query<IFarmerDashboard, void>({
      query: () => ({
        url: `farmer/farmer/dashboard/`,
        method: "Get",
      }),
    }),
    getBuyerDashboard: build.query<IBuyerDashboard, void>({
      query: () => ({
        url: `buyer/buyer/dashboard/`,
        method: "Get",
      }),
    }),
    getTransporterDashboard: build.query<ITransporterDashboard, void>({
      query: () => ({
        url: `transporter/transporter-dashboard/`,
        method: "Get",
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