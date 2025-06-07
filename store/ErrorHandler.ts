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
  // Check if action.payload is not undefined
  if (action.payload) {
    const { data, status } = action.payload;

    // Check if there's a network-related error
    if (status === "FETCH_ERROR") {
      return "Network error: Please check your internet connection.";
    }

    // Check if the payload contains data with a message (error response from API)
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }
  // Return a generic message if no specific error message is found
  return "An unknown error occurred";
};