import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-white/10 bg-[#0f141d] px-4 text-sm text-white focus:border-[#7bff48]/60 focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
