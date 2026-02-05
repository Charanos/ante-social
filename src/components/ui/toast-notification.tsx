"use client";

import { motion, AnimatePresence } from "framer-motion";


import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { IconLoader2 } from '@tabler/icons-react';
import { IoAlertCircleOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoCloseOutline, IoInformationCircleOutline } from 'react-icons/io5';

export type ToastTypeEnum =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";
export type ToastType = ToastTypeEnum;

export interface Toast {
  id: string;
  type: ToastTypeEnum;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  loading: (message: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, message, description, duration = 3000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, message, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast],
  );

  const success = useCallback(
    (message: string, description?: string) => {
      addToast({ type: "success", message, description });
    },
    [addToast],
  );

  const error = useCallback(
    (message: string, description?: string) => {
      addToast({ type: "error", message, description });
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, description?: string) => {
      addToast({ type: "info", message, description });
    },
    [addToast],
  );

  const loading = useCallback(
    (message: string, description?: string) => {
      return addToast({ type: "loading", message, description, duration: 0 }); // 0 duration means it stays until manually removed
    },
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info, loading }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-100 flex flex-col gap-3 w-full max-w-sm p-4 md:p-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  id,
  type,
  message,
  description,
  onClose,
}: Toast & { onClose: () => void }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircleOutline className="h-5 w-5 text-green-600" />;
      case "error":
        return <IoCloseCircleOutline className="h-5 w-5 text-red-600" />;
      case "warning":
        return <IoAlertCircleOutline className="h-5 w-5 text-amber-600" />;
      case "info":
        return <IoInformationCircleOutline className="h-5 w-5 text-blue-600" />;
      case "loading":
        return <IconLoader2 className="h-5 w-5 text-neutral-600 animate-spin" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "border-green-100 bg-white shadow-green-100/50";
      case "error":
        return "border-red-100 bg-white shadow-red-100/50";
      case "warning":
        return "border-amber-100 bg-white shadow-amber-100/50";
      case "info":
        return "border-blue-100 bg-white shadow-blue-100/50";
      case "loading":
        return "border-neutral-100 bg-white";
      default:
        return "border-neutral-100 bg-white";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "pointer-events-auto w-full overflow-hidden rounded-2xl border shadow-xl p-4 flex items-start gap-3 backdrop-blur-sm",
        getStyles(),
      )}
    >
      <div className="mt-0.5 shrink-0 bg-neutral-50 p-1.5 rounded-full">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-neutral-900 leading-none mb-1">
          {message}
        </p>
        {description && (
          <p className="text-xs font-medium text-neutral-500 leading-snug">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
      >
        <IoCloseOutline className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
