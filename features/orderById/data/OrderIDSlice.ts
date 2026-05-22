// features/orderById/data/OrderIDSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import { acceptOrder, cancelOrder, getOneOrder } from "./OrderIDApi";

const initialState: IOrderByIdInitialState = {
  getOneOrderLoading: false,
  getOneOrderError: "",
  acceptOrderLoading: false,
  acceptOrderError: "",
  cancelOrderLoading: false,
  cancelOrderError: "",
  order: null,
};

const OrderIDSlice = createSlice({
  name: "orderById",
  initialState,
  reducers: {
    clearOrderByIdError: (state) => {
      state.getOneOrderError = initialState.getOneOrderError;
      state.acceptOrderError = initialState.acceptOrderError;
      state.cancelOrderError = initialState.cancelOrderError;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => initialState);

    // Get one order
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
    builder.addMatcher(getOneOrder.matchRejected, (state, action) => {
      state.getOneOrderLoading = false;
      state.getOneOrderError = returnError(action);
    });

    // Accept an order
    builder.addMatcher(acceptOrder.matchPending, (state) => {
      state.acceptOrderLoading = true;
    });
    builder.addMatcher(acceptOrder.matchFulfilled, (state) => {
      state.acceptOrderLoading = false;
    });
    builder.addMatcher(acceptOrder.matchRejected, (state, action) => {
      state.acceptOrderLoading = false;
      state.acceptOrderError = returnError(action);
    });

    // Cancel an order
    builder.addMatcher(cancelOrder.matchPending, (state) => {
      state.cancelOrderLoading = true;
    });
    builder.addMatcher(cancelOrder.matchFulfilled, (state) => {
      state.cancelOrderLoading = false;
    });
    builder.addMatcher(cancelOrder.matchRejected, (state, action) => {
      state.cancelOrderLoading = false;
      state.cancelOrderError = returnError(action);
    });
  },
});

export const { clearOrderByIdError } = OrderIDSlice.actions;
export default OrderIDSlice.reducer;