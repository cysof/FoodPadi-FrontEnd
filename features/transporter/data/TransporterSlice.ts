// features/transporter/data/TransporterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import {
  getAllDeliveries,
  getOneDelivery,
  acceptDelivery,
  startDelivery,
  completeDelivery,
  cancelDelivery,
  rejectDelivery,
} from "./TransporterApi";

const initialState: ITransporterInitialState = {
  // Get all deliveries
  getAllDeliveriesLoading: false,
  getAllDeliveriesError: "",
  deliveries: [],
  // ✅ Added pagination fields
  count: 0,
  next: null,
  previous: null,

  // Get one delivery
  getOneDeliveryLoading: false,
  getOneDeliveryError: "",
  selectedDelivery: null,

  // Accept delivery
  acceptDeliveryLoading: false,
  acceptDeliveryError: "",

  // Start delivery
  startDeliveryLoading: false,
  startDeliveryError: "",

  // Complete delivery
  completeDeliveryLoading: false,
  completeDeliveryError: "",

  // Cancel delivery
  cancelDeliveryLoading: false,
  cancelDeliveryError: "",

  // Reject delivery
  rejectDeliveryLoading: false,
  rejectDeliveryError: "",
};

const TransporterSlice = createSlice({
  name: "transporter",
  initialState,
  reducers: {
    clearTransporterErrors: (state) => {
      state.getAllDeliveriesError = initialState.getAllDeliveriesError;
      state.getOneDeliveryError = initialState.getOneDeliveryError;
      state.acceptDeliveryError = initialState.acceptDeliveryError;
      state.startDeliveryError = initialState.startDeliveryError;
      state.completeDeliveryError = initialState.completeDeliveryError;
      state.cancelDeliveryError = initialState.cancelDeliveryError;
      state.rejectDeliveryError = initialState.rejectDeliveryError;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => initialState);

    // Get all deliveries
    builder.addMatcher(getAllDeliveries.matchPending, (state) => {
      state.getAllDeliveriesLoading = true;
    });
    builder.addMatcher(
      getAllDeliveries.matchFulfilled,
      (state, action: PayloadAction<ITransporterDashboardResponse>) => {
        state.getAllDeliveriesLoading = false;
        state.deliveries = action.payload.results;
        // ✅ Added pagination fields
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      }
    );
    builder.addMatcher(getAllDeliveries.matchRejected, (state, action) => {
      state.getAllDeliveriesLoading = false;
      state.getAllDeliveriesError = returnError(action);
    });

    // Get one delivery
    builder.addMatcher(getOneDelivery.matchPending, (state) => {
      state.getOneDeliveryLoading = true;
    });
    builder.addMatcher(
      getOneDelivery.matchFulfilled,
      (state, action: PayloadAction<ITransporterDelivery>) => {
        state.getOneDeliveryLoading = false;
        state.selectedDelivery = action.payload;
      }
    );
    builder.addMatcher(getOneDelivery.matchRejected, (state, action) => {
      state.getOneDeliveryLoading = false;
      state.getOneDeliveryError = returnError(action);
    });

    // Accept delivery
    builder.addMatcher(acceptDelivery.matchPending, (state) => {
      state.acceptDeliveryLoading = true;
    });
    builder.addMatcher(acceptDelivery.matchFulfilled, (state) => {
      state.acceptDeliveryLoading = false;
    });
    builder.addMatcher(acceptDelivery.matchRejected, (state, action) => {
      state.acceptDeliveryLoading = false;
      state.acceptDeliveryError = returnError(action);
    });

    // Start delivery
    builder.addMatcher(startDelivery.matchPending, (state) => {
      state.startDeliveryLoading = true;
    });
    builder.addMatcher(startDelivery.matchFulfilled, (state) => {
      state.startDeliveryLoading = false;
    });
    builder.addMatcher(startDelivery.matchRejected, (state, action) => {
      state.startDeliveryLoading = false;
      state.startDeliveryError = returnError(action);
    });

    // Complete delivery
    builder.addMatcher(completeDelivery.matchPending, (state) => {
      state.completeDeliveryLoading = true;
    });
    builder.addMatcher(completeDelivery.matchFulfilled, (state) => {
      state.completeDeliveryLoading = false;
    });
    builder.addMatcher(completeDelivery.matchRejected, (state, action) => {
      state.completeDeliveryLoading = false;
      state.completeDeliveryError = returnError(action);
    });

    // Cancel delivery
    builder.addMatcher(cancelDelivery.matchPending, (state) => {
      state.cancelDeliveryLoading = true;
    });
    builder.addMatcher(cancelDelivery.matchFulfilled, (state) => {
      state.cancelDeliveryLoading = false;
    });
    builder.addMatcher(cancelDelivery.matchRejected, (state, action) => {
      state.cancelDeliveryLoading = false;
      state.cancelDeliveryError = returnError(action);
    });

    // Reject delivery
    builder.addMatcher(rejectDelivery.matchPending, (state) => {
      state.rejectDeliveryLoading = true;
    });
    builder.addMatcher(rejectDelivery.matchFulfilled, (state) => {
      state.rejectDeliveryLoading = false;
    });
    builder.addMatcher(rejectDelivery.matchRejected, (state, action) => {
      state.rejectDeliveryLoading = false;
      state.rejectDeliveryError = returnError(action);
    });
  },
});

export const { clearTransporterErrors } = TransporterSlice.actions;
export default TransporterSlice.reducer;