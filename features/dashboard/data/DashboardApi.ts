// features/dashboard/data/DashboardApi.ts
import { FetchAPI } from "@/store/FetchAPI";

const DashboardApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    // Farmer dashboard
    getFarmerDashboard: build.query<IFarmerDashboard, void>({
      query: () => ({
        url: `farmer/api/farmer/dashboard/`,
        method: "Get",
      }),
    }),

    // Buyer dashboard
    getBuyerDashboard: build.query<IBuyerDashboard, void>({
      query: () => ({
        url: `buyer/api/buyer/dashboard/`,
        method: "Get",
      }),
    }),

    // Transporter dashboard
    getTransporterDashboard: build.query<ITransporterDashboard, void>({
      query: () => ({
        url: `transporter/api/transporter-dashboard/`,
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