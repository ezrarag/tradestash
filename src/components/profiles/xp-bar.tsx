import { getNextTierThreshold } from "@/lib/xp";
import type { TierName } from "@/lib/types";

export function XpBar({ xp, tier }: { xp: number; tier: TierName }) {
  const nextTier = getNextTierThreshold(xp);
  const currentFloor =
    tier === "Legend"
      ? 1500
      : tier === "Veteran"
        ? 700
        : tier === "Trader"
          ? 300
          : tier === "Tracker"
            ? 100
            : 0;
  const progress = nextTier
    ? Math.min(100, ((xp - currentFloor) / (nextTier - currentFloor)) * 100)
    : 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/45">
        <span>{tier}</span>
        <span>{xp} XP</span>
      </div>
      <div className="h-3 rounded-full bg-white/8">
        <div
          className="h-3 rounded-full bg-[linear-gradient(90deg,#7bff48,#ff6a00)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-white/55">
        {nextTier ? `${nextTier - xp} XP to next tier` : "Auto-boost unlocked."}
      </p>
    </div>
  );
}
