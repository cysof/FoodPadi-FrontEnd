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
  PersistConfig,
} from "redux-persist";
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
import DashboardSlice from "@/features/dashboard/data/DashboardSlice";
import AccountSlice from "@/features/account/data/AccountSlice";
import BuyerOrderSlice from "@/features/order/data/BuyerOrderSlice";
import TransporterSlice from "@/features/transporter/data/TransporterSlice";
// // import VacancyIdSlice from "@/features/vacancyId/data/VacancyIdSlice";
// // import ForgotPasswordSlice from "@/features/forgotPassword/data/ForgotPasswordSlice";
// // import ResetPasswordSlice from "@/features/resetPassword/data/ResetPasswordSlice";

// SSR-safe storage engine.
// redux-persist/lib/storage touches window.localStorage at import time,
// which breaks/no-ops during Next.js server rendering. Only use real
// localStorage in the browser; fall back to a noop engine on the server.
const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

const rootReducer = combineReducers({
  register: RegisterSlice,
  login: LoginSlice,
  appSetting: AppSettingSlice,
  market: MarketPlaceSlice,
  crops: CropSlice,
  marketPlaceCrop: MarketCropIDSlice,
  orders: OrderSlice,
  orderById: OrderIDSlice,
  dashboard: DashboardSlice,
  account: AccountSlice,
  buyerOrders: BuyerOrderSlice,
  transporter: TransporterSlice,
  // homeNews: HomeNewsSlice,
  // dashboardVacancy: DashboardVacancySlice,
  // vacancies: VacancySlice,
  // forgotPassword: ForgotPasswordSlice,
  // resetPassword: ResetPasswordSlice,

  [LoginAPI.reducerPath]: LoginAPI.reducer,
  [FetchAPI.reducerPath]: FetchAPI.reducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerState> = {
  key: "FoodBank",
  storage,
  stateReconciler: autoMergeLevel2,
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
    "dashboard",
    "account",
    "buyerOrders",
    "transporter",
    // "vacancies",
    // "forgotPassword",
    // "resetPassword",
    // "homeNews",
    // "pricing",
    // "sideBarChat",
  ],
};

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