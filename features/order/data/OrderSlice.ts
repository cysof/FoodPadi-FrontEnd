// features/order/data/OrderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllOrders } from "./OrderApi";
import { returnError } from "@/store/ErrorHandler";

interface IOrderResponse {
  results: IOrder[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface getAllOrdersInitialState {
  orders: IOrder[];
  getAllOrdersError: string;
  getAllOrdersLoading: boolean;
  search: string;
  count: number;
  next: string | null;
  previous: string | null;
}

const initialState: getAllOrdersInitialState = {
  orders: [],
  getAllOrdersError: "",
  getAllOrdersLoading: false,
  search: "",
  count: 0,
  next: null,
  previous: null,
};

const OrderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.getAllOrdersError = initialState.getAllOrdersError;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Clear everything on logout - import actual logout action
    builder.addCase("logout", () => initialState);

    // Get all orders
    builder.addMatcher(getAllOrders.matchPending, (state) => {
      state.getAllOrdersLoading = true;
      state.getAllOrdersError = ""; // Clear error on new request
    });
    
    builder.addMatcher(
      getAllOrders.matchFulfilled,
      (state, action: PayloadAction<IOrderResponse>) => {
        state.getAllOrdersLoading = false;
        state.orders = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      }
    );
    
    builder.addMatcher(
      getAllOrders.matchRejected,
      (state, action) => {
        state.getAllOrdersLoading = false;
        state.getAllOrdersError = returnError(action);
      }
    );
  },
});

export const { clearOrdersError, setSearchTerm } = OrderSlice.actions;
export default OrderSlice.reducer;