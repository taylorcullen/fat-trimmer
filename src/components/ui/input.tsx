"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyles } from "@/lib/theme-styles";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    const { theme } = useTheme();
    const styles = getThemeStyles(theme);

    return (
      <div className="w-full">
        {label && (
          <label className={cn("block text-sm font-medium mb-1", styles.inputLabel)}>
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full rounded-lg px-4 py-2.5 border",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            "transition-all duration-200",
            styles.input,
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
