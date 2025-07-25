import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { setupListeners } from "@reduxjs/toolkit/query";
import { LoginAPI } from "./LoginAPI";
import { FetchAPI } from "./FetchAPI";
import RegisterSlice from "@/features/register/data/RegisterSlice";
import LoginSlice from "@/features/login/data/LoginSlice";
import AppSettingSlice from "@/components/data/AppSettingSlice";
import MarketPlaceSlice from "@/features/marketplace/data/MarketPlaceSlice";
import CropSlice from "@/features/crops/data/CropSlice";
import MarketCropIDSlice from "@/features/marketplaceCropId/data/MarketCropIDSlice";
import OrderSlice from "@/features/order/data/OrderSlice";
import OrderIDSlice from "@/features/orderById/data/OrderIDSlice";
// // import VacancyIdSlice from "@/features/vacancyId/data/VacancyIdSlice";
// // import ForgotPasswordSlice from "@/features/forgotPassword/data/ForgotPasswordSlice";
// // import ResetPasswordSlice from "@/features/resetPassword/data/ResetPasswordSlice";

const persistConfig = {
  key: "FoodBank",
  storage,
  autoMergeLevel2,
  blacklist: [
    LoginAPI.reducerPath,
    FetchAPI.reducerPath,
    "register",
    "appSetting",
    "market",
    "crops",
    "marketPlaceCrop",
    "orders",
    "orderById",
    // "vacancies",
    // "forgotPassword",
    // "resetPassword",
    // "homeNews",
    // "pricing",
    // "sideBarChat",
  ],
};

const rootReducer = combineReducers({
  register: RegisterSlice,
  login: LoginSlice,
  appSetting: AppSettingSlice,
  market: MarketPlaceSlice,
  crops: CropSlice,
  marketPlaceCrop: MarketCropIDSlice,
  orders: OrderSlice,
  orderById: OrderIDSlice,
  // homeNews: HomeNewsSlice,
  // dashboardVacancy: DashboardVacancySlice,
  // vacancies: VacancySlice,
  // forgotPassword: ForgotPasswordSlice,
  // resetPassword: ResetPasswordSlice,

  [LoginAPI.reducerPath]: LoginAPI.reducer,
  [FetchAPI.reducerPath]: FetchAPI.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(LoginAPI.middleware, FetchAPI.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
