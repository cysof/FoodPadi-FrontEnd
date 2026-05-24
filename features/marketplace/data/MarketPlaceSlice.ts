// features/marketplace/data/MarketPlaceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import { getAllProducts } from "./MarketApi";

const initialState: IMarketplaceInitialState = {
  getAllProductsLoading: false,
  getAllProductsError: "",
  products: [],
  search: "",
  count: 0,
  next: null,
  previous: null,
};

const MarketPlaceSlice = createSlice({
  name: "marketPlace",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(getAllProducts.matchPending, (state) => {
      state.getAllProductsLoading = true;
    });

    // ✅ Fixed: single matchFulfilled with all fields
    builder.addMatcher(
      getAllProducts.matchFulfilled,
      (state, action: PayloadAction<IGetMarketProduceResponse>) => {
        state.getAllProductsLoading = false;
        state.products = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      }
    );

    builder.addMatcher(
      getAllProducts.matchRejected,
      (state, action) => {
        state.getAllProductsLoading = false;
        state.getAllProductsError = returnError(action);
      }
    );
  },
});

export const { setSearchTerm } = MarketPlaceSlice.actions;
export default MarketPlaceSlice.reducer;