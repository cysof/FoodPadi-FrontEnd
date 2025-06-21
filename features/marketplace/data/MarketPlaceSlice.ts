import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";
import { getAllProducts } from "./MarketApi";

const initialState: IMarketplaceInitialState = {
  getAllProductsLoading: false,
  getAllProductsError: "",
  products: [],
  search: "",
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

    builder.addMatcher(
      getAllProducts.matchFulfilled,
      (state, action: PayloadAction<IGetMarketProduceResponse>) => {
        state.getAllProductsLoading = false;
        state.products = action.payload.results;
      }
    );

    builder.addMatcher(
      getAllProducts.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.getAllProductsLoading = false;
        state.getAllProductsError = returnError(action);
      }
    );
  },
});

export const { setSearchTerm } = MarketPlaceSlice.actions;

export default MarketPlaceSlice.reducer;
