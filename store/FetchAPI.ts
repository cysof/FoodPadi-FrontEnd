import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { setToken } from "@/features/login/data/LoginSlice";
// import { clearToken, setToken } from "@/features/login/data/LoginSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // this gets the token from the state
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
    // this gets the token from the state
    const token = (getState() as RootState).login.token.access;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const refreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOption) => {
  let result = await baseQuery(args, api, extraOption);

  if (result.error && result.error.status === 401) {
    // const accessToken = (api.getState() as RootState).login?.lawyer.jwtToken;
    const refreshToken = (api.getState() as RootState).login?.token.refresh;
    // Try to get a new token
    const refreshResult = await accountBaseQuery(
      {
        url: `/token/refresh/`,
        // url: `/accounts/api/token/refresh/`,
        method: "Post",
        body: {
          refresh: refreshToken,
        },
        // credentials: "include",
      },
      api,
      extraOption
    );

    if (refreshResult.error && refreshResult.error.status === 401) {
      api.dispatch({ type: "logout" });
      return refreshResult;
    }

    if (refreshResult.data) {
      // Assuming refreshResult.data contains the new auth token
      const newAuthToken = refreshResult.data as IToken;
      api.dispatch(setToken(newAuthToken));
      // api.dispatch(set)
      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOption);
    } else {
      api.dispatch({ type: "logout" });
    }
  }

  return result;
};

export const FetchAPI = createApi({
  reducerPath: `fetchAPI`,
  baseQuery: refreshToken,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  tagTypes: ["crops", "orders"],
  endpoints: () => ({}),
});
