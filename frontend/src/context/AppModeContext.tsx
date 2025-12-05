import React, { createContext, useContext, useState, useEffect } from "react";

type AppMode = "demo" | "live";

interface AppModeContextValue {
  mode: AppMode;
  isDemo: boolean;
  isDevMode: boolean;
  toggleMode: () => void;
  setMode: (m: AppMode) => void;
}

const AppModeContext = createContext<AppModeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "fundmeup-mode";
const DEV_MODE_KEY = "fundmeup-dev-mode";

// Check if dev mode is enabled
const checkDevMode = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // Check query param
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('dev') === 'true') {
    localStorage.setItem(DEV_MODE_KEY, 'true');
    return true;
  }
  
  // Check localStorage
  const saved = localStorage.getItem(DEV_MODE_KEY);
  return saved === 'true';
};

// Enable dev mode with Ctrl+Shift+D
if (typeof window !== "undefined") {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      const current = localStorage.getItem(DEV_MODE_KEY) === 'true';
      localStorage.setItem(DEV_MODE_KEY, (!current).toString());
      window.location.reload();
    }
  });
}

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

  const [isDevMode, setIsDevMode] = useState(() => checkDevMode());

  useEffect(() => {
    // Check for dev mode on mount and when query params change
    setIsDevMode(checkDevMode());
  }, []);

  const setMode = (m: AppMode) => {
    setModeState(m);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, m);
    }
  };

  const toggleMode = () => {
    if (!isDevMode) return; // Only allow toggle in dev mode
    setMode(mode === "demo" ? "live" : "demo");
  };

  const value: AppModeContextValue = {
    mode,
    isDemo: mode === "demo",
    isDevMode,
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


