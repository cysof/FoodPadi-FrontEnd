import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCrop, editACrop, getAllCrops } from "./CropApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import { returnError } from "@/store/ErrorHandler";
// import { createCrop } from "./CropApi";

const initialState: ICropInitialState = {
  crops: [],
  selectedCrop: {
    availability: "",
    created_at: "",
    crop_description: "",
    crop_name: "",
    farmer: 0,
    farmer_name: "",
    harvested_date: "",
    id: 0,
    img: "",
    is_Organic: false,
    location: "",
    price_per_unit: 0,
    quantity: 0,
    unit: "",
  },
  getAllCropsError: "",
  createCropsLoading: false,
  createCropsError: "",
  updateCropsLoading: false,
  updateCropsError: "",
  deleteCropsLoading: false,
  deleteCropsError: "",
  getAllCropsLoading: false,
  showCreateCropModal: false,
  showUpdateCropModal: false,
  search: "",
};

const CropSlice = createSlice({
  name: "crops",
  initialState,
  reducers: {
    clearCropsError: (state) => {
      state.getAllCropsError = initialState.getAllCropsError;
      state.createCropsError = initialState.createCropsError;
      state.deleteCropsError = initialState.deleteCropsError;
      state.updateCropsError = initialState.updateCropsError;
    },

    setShowCreateCropModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateCropModal = action.payload;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setShowUpdateCropModal: (
      state,
      action: PayloadAction<{ id?: number; show: boolean }>
    ) => {
      state.showUpdateCropModal = action.payload.show;
      const foundCrop = state.crops.find(
        (crop) => crop.id === action.payload.id
      );
      if (foundCrop) state.selectedCrop = foundCrop;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => {
      return initialState;
    });

    // Create a crop
    builder.addMatcher(createCrop.matchPending, (state) => {
      state.createCropsLoading = true;
    });

    builder.addMatcher(createCrop.matchFulfilled, (state) => {
      state.createCropsLoading = false;
    });

    builder.addMatcher(
      createCrop.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.createCropsLoading = false;
        state.createCropsError = returnError(action);
      }
    );

    // update a crop
    builder.addMatcher(editACrop.matchPending, (state) => {
      state.updateCropsLoading = true;
    });

    builder.addMatcher(editACrop.matchFulfilled, (state) => {
      state.updateCropsLoading = false;
    });

    builder.addMatcher(
      editACrop.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.updateCropsLoading = false;
        state.updateCropsError = returnError(action);
      }
    );

    // Get all the Crops
    builder.addMatcher(getAllCrops.matchPending, (state) => {
      state.getAllCropsLoading = true;
    });

    builder.addMatcher(
      getAllCrops.matchFulfilled,
      (state, action: PayloadAction<IGetMarketProduceResponse>) => {
        state.getAllCropsLoading = false;
        state.crops = action.payload.results;
      }
    );

    builder.addMatcher(
      getAllCrops.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.getAllCropsLoading = false;
        state.getAllCropsError = returnError(action);
      }
    );

    // Delete a Crop
    builder.addMatcher(getAllCrops.matchPending, (state) => {
      state.deleteCropsLoading = true;
    });

    builder.addMatcher(getAllCrops.matchFulfilled, (state) => {
      state.deleteCropsLoading = false;
    });

    builder.addMatcher(
      getAllCrops.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.deleteCropsLoading = false;
        state.deleteCropsError = returnError(action);
      }
    );
  },
});

export const {
  clearCropsError,
  setShowCreateCropModal,
  setShowUpdateCropModal,
  setSearchTerm,
} = CropSlice.actions;

export default CropSlice.reducer;
