// features/account/data/AccountSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { returnError } from "@/store/ErrorHandler";
import { getProfile, updateProfile, changePassword } from "./AccountApi";
import { setToken } from "@/features/login/data/LoginSlice";

const initialState: IAccountInitialState = {
  // Get profile
  getProfileLoading: false,
  getProfileError: "",

  // Update profile
  updateProfileLoading: false,
  updateProfileError: "",

  // Change password
  changePasswordLoading: false,
  changePasswordError: "",
};

const AccountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountErrors: (state) => {
      state.getProfileError = initialState.getProfileError;
      state.updateProfileError = initialState.updateProfileError;
      state.changePasswordError = initialState.changePasswordError;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => initialState);

    // Get profile
    builder.addMatcher(getProfile.matchPending, (state) => {
      state.getProfileLoading = true;
    });
    builder.addMatcher(getProfile.matchFulfilled, (state) => {
      state.getProfileLoading = false;
    });
    builder.addMatcher(getProfile.matchRejected, (state, action) => {
      state.getProfileLoading = false;
      state.getProfileError = returnError(action);
    });

    // Update profile
    builder.addMatcher(updateProfile.matchPending, (state) => {
      state.updateProfileLoading = true;
    });
    builder.addMatcher(
      updateProfile.matchFulfilled,
      (state, action: PayloadAction<IUpdateProfileResponse>) => {
        state.updateProfileLoading = false;
      }
    );
    builder.addMatcher(updateProfile.matchRejected, (state, action) => {
      state.updateProfileLoading = false;
      state.updateProfileError = returnError(action);
    });

    // Change password
    builder.addMatcher(changePassword.matchPending, (state) => {
      state.changePasswordLoading = true;
    });
    builder.addMatcher(changePassword.matchFulfilled, (state) => {
      state.changePasswordLoading = false;
    });
    builder.addMatcher(changePassword.matchRejected, (state, action) => {
      state.changePasswordLoading = false;
      state.changePasswordError = returnError(action);
    });
  },
});

export const { clearAccountErrors } = AccountSlice.actions;
export default AccountSlice.reducer;