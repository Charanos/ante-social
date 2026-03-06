"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconAlertTriangle, IconLoader3, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30",
    },
    warning: {
      icon: "bg-amber-100",
      iconColor: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30",
    },
    default: {
      icon: "bg-neutral-100",
      iconColor: "text-neutral-600",
      button: "bg-neutral-900 hover:bg-neutral-800 text-white shadow-black/20",
    },
  };

  const styles = variantStyles[variant];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl pointer-events-auto border border-neutral-100">
              {/* Header */}
              <div className="p-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${styles.icon}`}>
                    <IconAlertTriangle
                      className={`w-6 h-6 ${styles.iconColor}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <IconX className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pb-6">
                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {message}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-2 rounded-xl border-2 border-neutral-200 bg-white text-neutral-700 font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 ${styles.button}`}
                  >
                    {isLoading ? (
                      <IconLoader3 className="w-4 h-4 animate-spin" />
                    ) : (
                      confirmLabel
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
