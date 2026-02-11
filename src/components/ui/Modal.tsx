
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl pointer-events-auto border border-white/20">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                {title && <h3 className="text-xl font-semibold text-black">{title}</h3>}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <IconX className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
