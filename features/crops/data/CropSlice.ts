import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import { returnError } from "@/store/ErrorHandler";
// import { createCrop } from "./CropApi";

const initialState: LoginInitialState = {
  loginLoading: false,
  loginError: "",
  user: {
    account_type: "",
    address: "",
    city: "",
    country: "",
    email: "",
    first_name: "",
    gender: "",
    id: 0,
    is_active: false,
    is_staff: false,
    is_superuser: false,
    last_name: "",
    other_name: "",
    phone_number: "",
    state: "",
    username: "",
  },
  token: {
    access: "",
    refresh: "",
  },
};

const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginError: (state) => {
      state.loginError = initialState.loginError;
    },

    setToken: (state, action: PayloadAction<IToken>) => {
      state.token.refresh = action.payload.refresh;
      state.token.access = action.payload.access;
    },

    clearToken: (state) => {
      state.token = initialState.token;
    },
  },
  extraReducers: (builder) => {
    /* clear everything on logout */
    builder.addCase("logout", () => {
      return initialState;
    });
    
    // builder.addMatcher(loginUser.matchPending, (state) => {
    //   state.loginLoading = true;
    // });

    // builder.addMatcher(
    //   loginUser.matchFulfilled,
    //   (state, action: PayloadAction<ILoginResponse>) => {
    //     state.loginLoading = false;
    //     state.token.access = action.payload.access;
    //     state.token.refresh = action.payload.refresh;
    //     state.user = action.payload.user;
    //   }
    // );

    // builder.addMatcher(
    //   loginUser.matchRejected,
    //   (
    //     state,
    //     action: PayloadAction<
    //       (FetchBaseQueryError & { data?: unknown }) | undefined
    //     >
    //   ) => {
    //     state.loginLoading = false;
    //     state.loginError = returnError(action);
    //   }
    // );
  },
});

export const { clearLoginError, clearToken, setToken } = LoginSlice.actions;

export default LoginSlice.reducer;
