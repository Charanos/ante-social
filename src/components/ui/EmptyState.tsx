"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-dashed border-black/10 bg-black/2"
    >
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
        <Icon className="w-8 h-8 text-black/40" />
      </div>

      <h3 className="text-lg font-semibold text-black/90 mb-2">{title}</h3>
      <p className="text-sm text-black/50 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {actionLabel && (actionLink || onAction) && (
        actionLink ? (
          <Link
            href={actionLink}
            className="group inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition-all"
          >
            {actionLabel}
            <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="group inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition-all cursor-pointer"
          >
            {actionLabel}
            <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )
      )}
    </motion.div>
  );
}
