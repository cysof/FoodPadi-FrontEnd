import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllOrders } from "./OrderApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";

const initialState: getAllOrdersInitialState = {
  orders: [],
  // selectedCrop: {
  //   availability: "",
  //   created_at: "",
  //   crop_description: "",
  //   crop_name: "",
  //   farmer: 0,
  //   farmer_name: "",
  //   harvested_date: "",
  //   id: 0,
  //   img: "",
  //   is_Organic: false,
  //   location: "",
  //   price_per_unit: 0,
  //   quantity: 0,
  //   unit: "",
  // },
  getAllOrdersError: "",
  getAllOrdersLoading: false,
  // createCropsError: "",
  // updateCropsLoading: false,
  // updateCropsError: "",
  // deleteCropsLoading: false,
  // deleteCropsError: "",
  // getAllCropsLoading: false,
  // showCreateCropModal: false,
  // showUpdateCropModal: false,
  search: "",
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
    /* clear everything on logout */
    builder.addCase("logout", () => {
      return initialState;
    });

    // Create a crop
    builder.addMatcher(getAllOrders.matchPending, (state) => {
      state.getAllOrdersLoading = true;
    });

    builder.addMatcher(
      getAllOrders.matchFulfilled,
      (state, action: PayloadAction<IOrderResponse>) => {
        state.getAllOrdersLoading = false;
        state.orders = action.payload.results;
      }
    );

    builder.addMatcher(
      getAllOrders.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.getAllOrdersLoading = false;
        state.getAllOrdersError = returnError(action);
      }
    );

    // // update a crop
    // builder.addMatcher(editACrop.matchPending, (state) => {
    //   state.updateCropsLoading = true;
    // });

    // builder.addMatcher(editACrop.matchFulfilled, (state) => {
    //   state.updateCropsLoading = false;
    // });

    // builder.addMatcher(
    //   editACrop.matchRejected,
    //   (
    //     state,
    //     action: PayloadAction<
    //       (FetchBaseQueryError & { data?: unknown }) | undefined
    //     >
    //   ) => {
    //     state.updateCropsLoading = false;
    //     state.updateCropsError = returnError(action);
    //   }
    // );

    // // Get all the Crops
    // builder.addMatcher(getAllCrops.matchPending, (state) => {
    //   state.getAllCropsLoading = true;
    // });

    // builder.addMatcher(
    //   getAllCrops.matchFulfilled,
    //   (state, action: PayloadAction<IGetMarketProduceResponse>) => {
    //     state.getAllCropsLoading = false;
    //     state.crops = action.payload.results;
    //   }
    // );

    // builder.addMatcher(
    //   getAllCrops.matchRejected,
    //   (
    //     state,
    //     action: PayloadAction<
    //       (FetchBaseQueryError & { data?: unknown }) | undefined
    //     >
    //   ) => {
    //     state.getAllCropsLoading = false;
    //     state.getAllCropsError = returnError(action);
    //   }
    // );

    // // Delete a Crop
    // builder.addMatcher(getAllCrops.matchPending, (state) => {
    //   state.deleteCropsLoading = true;
    // });

    // builder.addMatcher(getAllCrops.matchFulfilled, (state) => {
    //   state.deleteCropsLoading = false;
    // });

    // builder.addMatcher(
    //   getAllCrops.matchRejected,
    //   (
    //     state,
    //     action: PayloadAction<
    //       (FetchBaseQueryError & { data?: unknown }) | undefined
    //     >
    //   ) => {
    //     state.deleteCropsLoading = false;
    //     state.deleteCropsError = returnError(action);
    //   }
    // );
  },
});

export const { clearOrdersError, setSearchTerm } = OrderSlice.actions;

export default OrderSlice.reducer;
