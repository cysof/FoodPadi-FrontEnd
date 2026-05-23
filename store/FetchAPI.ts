// store/FetchAPI.ts
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { setToken } from "@/features/login/data/LoginSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).login.token.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const accountBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).login.token.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// ✅ Fixed: using async function declaration instead of const arrow function
async function baseQueryWithReauth(
  args: string | FetchArgs,
  api: Parameters<BaseQueryFn>[1],
  extraOption: Parameters<BaseQueryFn>[2]
) {
  let result = await baseQuery(args, api, extraOption);
  if (result.error && result.error.status === 401) {
    const currentRefreshToken = (api.getState() as RootState).login?.token.refresh;
    const refreshResult = await accountBaseQuery(
      {
        url: `/token/refresh/`,
        method: "Post",
        body: {
          refresh: currentRefreshToken,
        },
      },
      api,
      extraOption
    );
    if (refreshResult.error && refreshResult.error.status === 401) {
      api.dispatch({ type: "logout" });
      return refreshResult;
    }
    if (refreshResult.data) {
      const newAuthToken = refreshResult.data as IToken;
      api.dispatch(setToken(newAuthToken));
      result = await baseQuery(args, api, extraOption);
    } else {
      api.dispatch({ type: "logout" });
    }
  }
  return result;
}

export const FetchAPI = createApi({
  reducerPath: `fetchAPI`,
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  tagTypes: ["crops", "orders", "profile", "deliveries"],
  endpoints: () => ({}),
});