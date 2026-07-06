import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCrop, editACrop, getAllCrops } from "./CropApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";

type RejectedAction = PayloadAction<(FetchBaseQueryError & { data?: unknown }) | undefined>;

const initialState: ICropInitialState = {
  crops: [],
  count: 0,
  next: null,
  previous: null,
  selectedCrop: {
    availability: "",
    created_at: "",
    crop_description: "",
    crop_name: "",
    category: null,
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
    unit: { id: 0, name: "", is_other: false },
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
    builder.addCase("logout", () => {
      return initialState;
    });
    builder.addMatcher(createCrop.matchPending, (state) => {
      state.createCropsLoading = true;
    });
    builder.addMatcher(createCrop.matchFulfilled, (state) => {
      state.createCropsLoading = false;
    });
    builder.addMatcher(createCrop.matchRejected, (state, action: RejectedAction) => {
      state.createCropsLoading = false;
      state.createCropsError = returnError(action);
    });
    builder.addMatcher(editACrop.matchPending, (state) => {
      state.updateCropsLoading = true;
    });
    builder.addMatcher(editACrop.matchFulfilled, (state) => {
      state.updateCropsLoading = false;
    });
    builder.addMatcher(editACrop.matchRejected, (state, action: RejectedAction) => {
      state.updateCropsLoading = false;
      state.updateCropsError = returnError(action);
    });
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
    builder.addMatcher(getAllCrops.matchRejected, (state, action: RejectedAction) => {
      state.getAllCropsLoading = false;
      state.getAllCropsError = returnError(action);
    });
    builder.addMatcher(getAllCrops.matchPending, (state) => {
      state.deleteCropsLoading = true;
    });
    builder.addMatcher(getAllCrops.matchFulfilled, (state) => {
      state.deleteCropsLoading = false;
    });
    builder.addMatcher(getAllCrops.matchRejected, (state, action: RejectedAction) => {
      state.deleteCropsLoading = false;
      state.deleteCropsError = returnError(action);
    });
  },
});

export const {
  clearCropsError,
  setShowCreateCropModal,
  setShowUpdateCropModal,
  setSearchTerm,
} = CropSlice.actions;
export default CropSlice.reducer;
