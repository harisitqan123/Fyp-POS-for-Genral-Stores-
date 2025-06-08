// src/app/Providers.tsx or src/Providers.tsx
"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/Redux Store";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
