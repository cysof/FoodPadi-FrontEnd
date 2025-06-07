import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const LoginAPI = createApi({
  reducerPath: `loginApi`,
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }),
  // refetchOnMountOrArgChange: true,
  // refetchOnReconnect: true,
  // tagTypes: ["encounters"],
  endpoints: () => ({}),
});
