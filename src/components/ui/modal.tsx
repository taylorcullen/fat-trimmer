"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyles } from "@/lib/theme-styles";
import { Fragment, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  const { theme } = useTheme();
  const styles = getThemeStyles(theme);

  if (!isOpen) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={cn(
            "rounded-xl border shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto",
            styles.modal,
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className={cn("flex items-center justify-between p-4 border-b", styles.modalHeader)}>
              <h2 className={cn("text-lg font-semibold", styles.text)}>{title}</h2>
              <button
                onClick={onClose}
                className={cn("transition-colors", styles.mutedText, "hover:text-white")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}
