import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { returnError } from "@/store/ErrorHandler";
import { registerUser } from "./RegisterApi";

const initialState: RegisterInitialState = {
  registerLoading: false,
  registerError: "",
};
const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearRegisterError: (state) => {
      state.registerError = initialState.registerError;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(registerUser.matchPending, (state) => {
      state.registerLoading = true;
    });

    builder.addMatcher(registerUser.matchFulfilled, (state) => {
      state.registerLoading = false;
    });

    builder.addMatcher(
      registerUser.matchRejected,
      (
        state,
        action: PayloadAction<
          (FetchBaseQueryError & { data?: unknown }) | undefined
        >
      ) => {
        state.registerLoading = false;
        state.registerError = returnError(action);
      }
    );
  },
});

export const { clearRegisterError } = RegisterSlice.actions;

export default RegisterSlice.reducer;
