import React, { createContext, useContext, useState, useEffect } from "react";

type AppMode = "demo" | "live";

interface AppModeContextValue {
  mode: AppMode;
  isDemo: boolean;
  toggleMode: () => void;
  setMode: (m: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "fundmeup-mode";

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<AppMode>(() => {
    if (typeof window === "undefined") return "demo";

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "demo" || saved === "live") return saved as AppMode;

    // default from env if present
    const envDefault =
      (import.meta.env.VITE_DEFAULT_MODE as AppMode | undefined) ?? "demo";
    return envDefault;
  });

  const setMode = (m: AppMode) => {
    setModeState(m);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, m);
    }
  };

  const toggleMode = () => {
    setMode(mode === "demo" ? "live" : "demo");
  };

  const value: AppModeContextValue = {
    mode,
    isDemo: mode === "demo",
    toggleMode,
    setMode,
  };

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = () => {
  const ctx = useContext(AppModeContext);
  if (!ctx) {
    throw new Error("useAppMode must be used within AppModeProvider");
  }
  return ctx;
};


