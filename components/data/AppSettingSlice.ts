import { logout } from "@/features/crops/data/CropApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AppSettingInitialState = {
  expandSidebar: false,
  hideSideBar: true,
  logoutLoading: false,
};

const AppSettingSlice = createSlice({
  name: "AppSetting",
  initialState,
  reducers: {
    setExpandSide: (state, action: PayloadAction<boolean>) => {
      state.expandSidebar = action.payload;
    },

    setHideSideBar: (state, action: PayloadAction<boolean>) => {
      state.hideSideBar = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => {
      return initialState;
    });

    builder.addMatcher(logout.matchPending, (state) => {
      state.logoutLoading = true;
    });

    builder.addMatcher(logout.matchFulfilled, (state) => {
      state.logoutLoading = false;
    });

    builder.addMatcher(logout.matchRejected, (state) => {
      state.logoutLoading = false;
    });
  },
});

export const { setExpandSide, setHideSideBar } = AppSettingSlice.actions;

export default AppSettingSlice.reducer;
