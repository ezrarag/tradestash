"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7bff48]/70 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[#7bff48] text-[#08110b] shadow-[0_0_30px_rgba(123,255,72,0.18)] hover:bg-[#93ff67]",
        variant === "secondary" &&
          "border border-white/12 bg-white/6 text-white hover:border-[#ff6a00]/50 hover:bg-[#ff6a00]/10",
        variant === "ghost" && "text-white/70 hover:bg-white/6 hover:text-white",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
