// features/crops/data/CropSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCrop, deleteACrop, editACrop, getAllCrops } from "../data/CropApi";
import { returnError } from "@/store/ErrorHandler";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const initialState: ICropInitialState = {
  count: 0,
  next: null,
  previous: null,
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
    image_url: "",
    additional_images: [],
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
    builder.addCase("logout", () => initialState);

    // Replace all matchRejected handlers with this pattern:

// Create a crop
builder.addMatcher(
  createCrop.matchRejected,
  (state, action: PayloadAction<(FetchBaseQueryError & { data?: unknown }) | undefined>) => {
    state.createCropsLoading = false;
    state.createCropsError = returnError(action);
  }
);

// Update a crop
builder.addMatcher(
  editACrop.matchRejected,
  (state, action: PayloadAction<(FetchBaseQueryError & { data?: unknown }) | undefined>) => {
    state.updateCropsLoading = false;
    state.updateCropsError = returnError(action);
  }
);

// Get all crops
builder.addMatcher(
  getAllCrops.matchRejected,
  (state, action: PayloadAction<(FetchBaseQueryError & { data?: unknown }) | undefined>) => {
    state.getAllCropsLoading = false;
    state.getAllCropsError = returnError(action);
  }
);

// Delete a crop
builder.addMatcher(
  deleteACrop.matchRejected,
  (state, action: PayloadAction<(FetchBaseQueryError & { data?: unknown }) | undefined>) => {
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