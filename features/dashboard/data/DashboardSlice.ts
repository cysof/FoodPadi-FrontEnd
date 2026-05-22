// features/dashboard/data/DashboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import {
  getFarmerDashboard,
  getBuyerDashboard,
  getTransporterDashboard,
} from "./DashboardApi";

const initialState: IDashboardInitialState = {
  // Farmer
  farmerDashboard: null,
  farmerDashboardLoading: false,
  farmerDashboardError: "",

  // Buyer
  buyerDashboard: null,
  buyerDashboardLoading: false,
  buyerDashboardError: "",

  // Transporter
  transporterDashboard: null,
  transporterDashboardLoading: false,
  transporterDashboardError: "",
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardErrors: (state) => {
      state.farmerDashboardError = initialState.farmerDashboardError;
      state.buyerDashboardError = initialState.buyerDashboardError;
      state.transporterDashboardError = initialState.transporterDashboardError;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => initialState);

    // Farmer dashboard
    builder.addMatcher(getFarmerDashboard.matchPending, (state) => {
      state.farmerDashboardLoading = true;
    });
    builder.addMatcher(
      getFarmerDashboard.matchFulfilled,
      (state, action: PayloadAction<IFarmerDashboard>) => {
        state.farmerDashboardLoading = false;
        state.farmerDashboard = action.payload;
      }
    );
    builder.addMatcher(getFarmerDashboard.matchRejected, (state, action) => {
      state.farmerDashboardLoading = false;
      state.farmerDashboardError = returnError(action);
    });

    // Buyer dashboard
    builder.addMatcher(getBuyerDashboard.matchPending, (state) => {
      state.buyerDashboardLoading = true;
    });
    builder.addMatcher(
      getBuyerDashboard.matchFulfilled,
      (state, action: PayloadAction<IBuyerDashboard>) => {
        state.buyerDashboardLoading = false;
        state.buyerDashboard = action.payload;
      }
    );
    builder.addMatcher(getBuyerDashboard.matchRejected, (state, action) => {
      state.buyerDashboardLoading = false;
      state.buyerDashboardError = returnError(action);
    });

    // Transporter dashboard
    builder.addMatcher(getTransporterDashboard.matchPending, (state) => {
      state.transporterDashboardLoading = true;
    });
    builder.addMatcher(
      getTransporterDashboard.matchFulfilled,
      (state, action: PayloadAction<ITransporterDashboard>) => {
        state.transporterDashboardLoading = false;
        state.transporterDashboard = action.payload;
      }
    );
    builder.addMatcher(
      getTransporterDashboard.matchRejected,
      (state, action) => {
        state.transporterDashboardLoading = false;
        state.transporterDashboardError = returnError(action);
      }
    );
  },
});

export const { clearDashboardErrors } = DashboardSlice.actions;
export default DashboardSlice.reducer;