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

// ✅ Custom handler for FormData to ensure proper multipart/form-data encoding
async function handleFormDataRequest(
  args: FetchArgs,
  getState: () => any,
  baseUrl: string
) {
  const token = (getState() as RootState).login.token.access;
  const headers = new Headers();
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Don't set Content-Type - let browser handle it for FormData
  const url = new URL(args.url || "", baseUrl).toString();
  
  try {
    const response = await fetch(url, {
      method: args.method || 'POST',
      headers,
      body: args.body,
      credentials: 'include',
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      return { error: { status: response.status, data } };
    }
    
    return { data };
  } catch (error: any) {
    return { error: { status: 0, data: error?.message } };
  }
}

// ✅ Fixed: using async function declaration instead of const arrow function
async function baseQueryWithReauth(
  args: string | FetchArgs,
  api: Parameters<BaseQueryFn>[1],
  extraOption: Parameters<BaseQueryFn>[2]
) {
  // Check if this is a FormData request
  if (typeof args === 'object' && args.body instanceof FormData) {
    return handleFormDataRequest(args, api.getState, process.env.NEXT_PUBLIC_BASE_URL || '');
  }
  
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
      
      // Re-check if it's FormData before retrying
      if (typeof args === 'object' && args.body instanceof FormData) {
        result = await handleFormDataRequest(args, api.getState, process.env.NEXT_PUBLIC_BASE_URL || '');
      } else {
        result = await baseQuery(args, api, extraOption);
      }
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