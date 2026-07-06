// features/marketplace/data/MarketPlaceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import { getAllProducts } from "./MarketApi";

const initialState: IMarketplaceInitialState = {
  getAllProductsLoading: false,
  getAllProductsError: "",
  products: [],
  search: "",
  selectedCategory: null,
  inStockOnly: false,
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
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategory = action.payload;
    },
    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
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

export const { setSearchTerm, setSelectedCategory, setInStockOnly } = MarketPlaceSlice.actions;
export default MarketPlaceSlice.reducer;
