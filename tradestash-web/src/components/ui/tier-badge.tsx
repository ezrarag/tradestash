import { cn } from "@/lib/utils";
import type { TierName } from "@/lib/types";

const tierClassMap: Record<TierName, string> = {
  Scout: "border-white/12 bg-white/6 text-white/70",
  Tracker: "border-[#59c4ff]/30 bg-[#59c4ff]/10 text-[#7ed4ff]",
  Trader: "border-[#7bff48]/30 bg-[#7bff48]/10 text-[#9eff78]",
  Veteran: "border-[#ffb000]/30 bg-[#ffb000]/10 text-[#ffc95b]",
  Legend: "border-[#ff6a00]/40 bg-[#ff6a00]/12 text-[#ff9a4d]",
};

export function TierBadge({
  tier,
  verified = false,
  className,
}: {
  tier: TierName;
  verified?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
        tierClassMap[tier],
        className,
      )}
    >
      {verified ? "Verified" : tier}
    </span>
  );
}
