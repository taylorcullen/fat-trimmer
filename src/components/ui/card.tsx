"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyles } from "@/lib/theme-styles";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient, children, ...props }, ref) => {
    const { theme } = useTheme();
    const styles = getThemeStyles(theme);

    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          "overflow-hidden",
          gradient && theme === "default" && "bg-gradient-to-br from-slate-800 to-slate-900",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();
    const styles = getThemeStyles(theme);
    return (
      <div ref={ref} className={cn(styles.cardHeader, className)} {...props} />
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();
    const styles = getThemeStyles(theme);
    return (
      <h3 ref={ref} className={cn(styles.cardTitle, className)} {...props} />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
