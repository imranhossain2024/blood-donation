"use client";

import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative mt-2">
        <input
          {...props}
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm pr-12 transition-all outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
            className
          )}
          ref={ref}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60 transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeClosed className="h-5 w-5" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
