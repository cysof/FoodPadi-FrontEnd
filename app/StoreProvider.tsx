"use client";
import { AppStore, store, persistor } from "@/store/store";
import Aos from "aos";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(null);

  if (!storeRef.current) {
    storeRef.current = store;
  }

  useEffect(() => {
    Aos.init({
      once: true,
      easing: "ease-in-out",
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={1}
          preventDuplicate
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {children}
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
