// store/ErrorHandler.ts
import { PayloadAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const returnError = (
  action: PayloadAction<
    | (FetchBaseQueryError & {
        data?: unknown;
      })
    | undefined
  >
): string => {
  if (action.payload) {
    const { data, status } = action.payload;

    // Network error
    if (status === "FETCH_ERROR") {
      return "Network error: Please check your internet connection.";
    }

    // Handle API error response
    if (data && typeof data === "object") {
      // Check for details.non_field_errors (your backend structure)
      if (
        "details" in data &&
        data.details &&
        typeof data.details === "object" &&
        "non_field_errors" in data.details &&
        Array.isArray(data.details.non_field_errors) &&
        data.details.non_field_errors.length > 0
      ) {
        return data.details.non_field_errors[0];
      }

      // Check for top-level error message
      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }

      // Check for message field (fallback)
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
    }
  }

  return "An unknown error occurred";
};