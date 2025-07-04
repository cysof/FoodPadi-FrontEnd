import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";
import { createOrder, getOneProduct } from "./MarketCropIDApi";

const initialState: IMarketCropIDInitialState = {
  getOneProductLoading: false,
  getOneProductError: "",
  createOrderLoading: false,
  createOrderError: "",
  product: null,
  loaded: false,
};
const MarketCropIDSlice = createSlice({
  name: "marketPlaceCrop",
  initialState,
  reducers: {
    clearMarketPlaceCropError: (state) => {
      state.getOneProductError = initialState.getOneProductError;
      state.createOrderError = initialState.createOrderError;
    },
  },
  extraReducers: (builder) => {
    // create an order
    builder.addMatcher(createOrder.matchPending, (state) => {
      state.createOrderLoading = true;
    });

    builder.addMatcher(createOrder.matchFulfilled, (state) => {
      state.createOrderLoading = false;
    });

    builder.addMatcher(
      createOrder.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.createOrderLoading = false;
        state.createOrderError = returnError(action);
      }
    );

    // get one product
    builder.addMatcher(getOneProduct.matchPending, (state) => {
      state.getOneProductLoading = true;
      state.loaded = false;
    });

    builder.addMatcher(
      getOneProduct.matchFulfilled,
      (state, action: PayloadAction<ICrop>) => {
        state.getOneProductLoading = false;
        state.loaded = true;
        state.product = action.payload;
      }
    );

    builder.addMatcher(
      getOneProduct.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        // state.getOneProductLoading = false;
        state.loaded = true;
        state.getOneProductError = returnError(action);
      }
    );
  },
});

export const { clearMarketPlaceCropError } = MarketCropIDSlice.actions;

export default MarketCropIDSlice.reducer;
