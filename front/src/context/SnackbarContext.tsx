import React, { createContext, useContext, useState } from "react";
import { CheckCircle, AlertCircle, X, XCircle } from "lucide-react";
import { SnackbarType } from "../types/types";


interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: SnackbarType;
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showSnackbar = (message: string, type: SnackbarType = "success") => {
    setSnackbar({ message, type, isVisible: true });
    setTimeout(
      () => setSnackbar((prev) => ({ ...prev, isVisible: false })),
      3000
    );
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {/* 스낵바 UI */}
      {snackbar.isVisible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl text-white min-w-[300px] transition-all ${
              snackbar.type === "success"
                ? "bg-emerald-500"
                : snackbar.type === "warning"
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          >
            {snackbar.type === "success" && <CheckCircle className="w-5 h-5" />}
            {snackbar.type === "warning" && <AlertCircle className="w-5 h-5" />}
            {snackbar.type === "error" && <XCircle className="w-5 h-5" />}
            <span className="flex-1 font-medium">{snackbar.message}</span>
            <button
              onClick={() =>
                setSnackbar((prev) => ({ ...prev, isVisible: false }))
              }
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};
