import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";
import { getOneOrder } from "./OrderIDApi";

const initialState: IOrderByIdInitialState = {
  getOneOrderLoading: false,
  getOneOrderError: "",
  order: null,
};
const OrderIDSlice = createSlice({
  name: "orderById",
  initialState,
  reducers: {
    clearOrderByIdError: (state) => {
      state.getOneOrderError = initialState.getOneOrderError;
    },
  },
  extraReducers: (builder) => {
    // get one product
    builder.addMatcher(getOneOrder.matchPending, (state) => {
      state.getOneOrderLoading = true;
    });

    builder.addMatcher(
      getOneOrder.matchFulfilled,
      (state, action: PayloadAction<IOrderData>) => {
        state.getOneOrderLoading = false;
        state.order = action.payload;
      }
    );

    builder.addMatcher(
      getOneOrder.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        // state.getOneOrderLoading = false;
        state.getOneOrderError = returnError(action);
      }
    );
  },
});

export const { clearOrderByIdError } = OrderIDSlice.actions;

export default OrderIDSlice.reducer;
