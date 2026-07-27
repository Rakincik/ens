"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import styles from "@/components/Toast/Toast.module.css";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => {
      clearTimeout(handle);
      setMounted(false);
    };
  }, []);

  const addToast = (message: string, type: ToastType) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // 4 saniye sonra otomatik kaldır
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toastAPI = useMemo(() => ({
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    warning: (message: string) => addToast(message, "warning"),
    info: (message: string) => addToast(message, "info"),
  }), []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
        return <Info size={20} />;
    }
  };

  const portalElement = mounted ? document.getElementById("toast-portal") : null;

  return (
    <ToastContext.Provider value={toastAPI}>
      {children}
      {mounted && portalElement &&
        createPortal(
          <div className={styles.toastContainer} style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 99999,
            pointerEvents: "none"
          }}>
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`${styles.toast} ${styles[toast.type]}`}
              >
                <div className={styles.icon}>{getIcon(toast.type)}</div>
                <div className={styles.message}>{toast.message}</div>
                <button
                  className={styles.closeBtn}
                  onClick={() => removeToast(toast.id)}
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>,
          portalElement
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
