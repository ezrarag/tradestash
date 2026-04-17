import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { getLeaderboard } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function LeaderboardsPage() {
  const leaderboards = await getLeaderboard();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Leaderboards</p>
        <h1 className="font-display text-5xl text-white">Most trusted traders by city.</h1>
        <p className="text-white/58">
          Monthly ranking keeps the board fresh while hall-of-fame legends retain long-term
          status. City cards are ready for campus splits once volume supports it.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {leaderboards.map((leaderboard) => (
          <LeaderboardTable key={leaderboard.city} leaderboard={leaderboard} />
        ))}
      </div>
    </div>
  );
}
