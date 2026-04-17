import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/ui/tier-badge";
import { formatNumber } from "@/lib/utils";
import type { Leaderboard } from "@/lib/types";

export function LeaderboardTable({ leaderboard }: { leaderboard: Leaderboard }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">
            Monthly leaderboard
          </p>
          <h3 className="font-display text-2xl text-white">{leaderboard.city}</h3>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.2em] text-white/45">
          <p>Hall of fame</p>
          <p>{leaderboard.hallOfFame.length} Legends</p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.topUsers.map((entry, index) => (
          <Link
            className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/4 px-4 py-3 transition hover:border-[#7bff48]/20 hover:bg-white/7"
            href={`/profile/${entry.uid}`}
            key={entry.uid}
          >
            <div className="flex items-center gap-4">
              <div className="font-display text-lg text-white/40">{String(index + 1).padStart(2, "0")}</div>
              <Avatar name={entry.displayName} size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">{entry.displayName}</p>
                <p className="text-xs text-white/45">
                  {entry.campus ?? entry.city} • {entry.completedTrades} trades
                </p>
              </div>
            </div>
            <div className="text-right">
              <TierBadge tier={entry.tier} verified={entry.verifiedBadge} />
              <p className="mt-2 text-sm font-semibold text-white">
                {formatNumber(entry.xp)} XP
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
