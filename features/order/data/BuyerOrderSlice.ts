// features/order/data/BuyerOrderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import { getAllBuyerOrders, cancelBuyerOrder } from "./BuyerOrderApi";

const initialState: IBuyerOrderInitialState = {
  getAllBuyerOrdersLoading: false,
  getAllBuyerOrdersError: "",
  cancelBuyerOrderLoading: false,
  cancelBuyerOrderError: "",
  buyerOrders: [],
  search: "",
  statusFilter: "",
  count: 0,
  next: null,
  previous: null,
};

const BuyerOrderSlice = createSlice({
  name: "buyerOrders",
  initialState,
  reducers: {
    clearBuyerOrderErrors: (state) => {
      state.getAllBuyerOrdersError = initialState.getAllBuyerOrdersError;
      state.cancelBuyerOrderError = initialState.cancelBuyerOrderError;
    },
    setBuyerOrderStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setBuyerOrderSearchTerm: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => initialState);

    // Get all buyer orders
    builder.addMatcher(getAllBuyerOrders.matchPending, (state) => {
      state.getAllBuyerOrdersLoading = true;
    });
    builder.addMatcher(
      getAllBuyerOrders.matchFulfilled,
      (state, action: PayloadAction<IBuyerOrderResponse>) => {
        state.getAllBuyerOrdersLoading = false;
        state.buyerOrders = action.payload.results;
        // ✅ Added pagination fields
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      }
    );
    builder.addMatcher(getAllBuyerOrders.matchRejected, (state, action) => {
      state.getAllBuyerOrdersLoading = false;
      state.getAllBuyerOrdersError = returnError(action);
    });

    // Cancel a buyer order
    builder.addMatcher(cancelBuyerOrder.matchPending, (state) => {
      state.cancelBuyerOrderLoading = true;
    });
    builder.addMatcher(cancelBuyerOrder.matchFulfilled, (state) => {
      state.cancelBuyerOrderLoading = false;
    });
    builder.addMatcher(cancelBuyerOrder.matchRejected, (state, action) => {
      state.cancelBuyerOrderLoading = false;
      state.cancelBuyerOrderError = returnError(action);
    });
  },
});

export const {
  clearBuyerOrderErrors,
  setBuyerOrderStatusFilter,
  setBuyerOrderSearchTerm,
} = BuyerOrderSlice.actions;

export default BuyerOrderSlice.reducer;