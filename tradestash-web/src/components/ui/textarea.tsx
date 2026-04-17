import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-[24px] border border-white/10 bg-[#0f141d] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[#7bff48]/60 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
