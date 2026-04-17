import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-[#0f141d] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#7bff48]/60 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
