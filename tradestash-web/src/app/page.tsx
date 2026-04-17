import Link from "next/link";
import {
  ArrowRight,
  Flame,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { LeaderboardTable } from "@/components/leaderboards/leaderboard-table";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { campusTargets, premiumBoostOptions } from "@/lib/constants";
import {
  getFeaturedListings,
  getLeaderboard,
  getMarketSnapshot,
} from "@/lib/data/queries";

export default async function Home() {
  const [featuredListings, marketSnapshot, leaderboards] = await Promise.all([
    getFeaturedListings(),
    getMarketSnapshot(),
    getLeaderboard(),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7bff48]/20 bg-[#7bff48]/8 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#b4ff88]">
              <Sparkles className="h-4 w-4" />
              DMV launch wave
            </div>
            <div className="space-y-5">
              <p className="font-display text-6xl leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
                Stop buying.
                <span className="block text-[#7bff48]">Start trading.</span>
              </p>
              <p className="max-w-2xl text-lg text-white/62">
                TradeStash turns unused stuff into campus clout. Post your stash, swap with
                people nearby, climb the leaderboard, and keep good gear out of the trash.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/browse">
                <Button className="h-12 px-6 text-base">
                  Explore the market
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/stash/new">
                <Button className="h-12 px-6 text-base" variant="secondary">
                  Post your first stash
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Live listings</p>
                <p className="font-display text-4xl text-white">{marketSnapshot.liveListings}</p>
              </Card>
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Completed trades</p>
                <p className="font-display text-4xl text-white">{marketSnapshot.completedTrades}</p>
              </Card>
              <Card className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Legends</p>
                <p className="font-display text-4xl text-white">{marketSnapshot.legends}</p>
              </Card>
            </div>
          </div>

          <Card className="hero-glow grid-lines relative overflow-hidden rounded-[36px] p-8">
            <div className="absolute right-6 top-6 rounded-full border border-[#ff6a00]/30 bg-[#ff6a00]/12 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#ffb27a]">
              Anti-waste economy
            </div>
            <div className="space-y-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Legend feed</p>
                  <h2 className="font-display text-4xl text-white">Campus clout, earned.</h2>
                </div>
                <Trophy className="h-10 w-10 text-[#7bff48]" />
              </div>

              <div className="space-y-3 rounded-[28px] border border-white/8 bg-[#0c1219]/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Trade XP</p>
                    <p className="text-sm text-white/52">Trade completed +50</p>
                  </div>
                  <span className="font-display text-3xl text-[#7bff48]">+50</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Close-range bonus</p>
                    <p className="text-sm text-white/52">Less than 5 miles +10</p>
                  </div>
                  <span className="font-display text-3xl text-[#ffb000]">+10</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Streak maintained</p>
                    <p className="text-sm text-white/52">Up to 6 days</p>
                  </div>
                  <span className="font-display text-3xl text-[#ff6a00]">+30</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#7bff48]" />
                    <p className="font-semibold text-white">Verified status</p>
                  </div>
                  <p className="mt-3 text-sm text-white/55">
                    Manual or ID-gated badge. Premium trust without turning the market into
                    pay-to-win.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-[#ff6a00]" />
                    <p className="font-semibold text-white">Ad boosts</p>
                  </div>
                  <p className="mt-3 text-sm text-white/55">
                    Legends auto-rise. Everyone else can buy visibility windows without buying
                    the trade itself.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Market pulse</p>
            <h2 className="font-display text-4xl text-white">Featured stash posts</h2>
          </div>
          <Link className="text-sm text-white/55 transition hover:text-white" href="/browse">
            Browse everything
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Campus launch plan</p>
          <h2 className="font-display text-4xl text-white">Ten campuses, one leaderboard culture.</h2>
          <p className="text-white/58">
            TradeStash starts with dense student communities where dorm turnover, book churn,
            and city identity all matter. That gives the leaderboard real gravity.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {campusTargets.map((campus) => (
            <Card className="space-y-3 p-4" key={campus}>
              <MapPin className="h-5 w-5 text-[#7bff48]" />
              <h3 className="font-semibold text-white">{campus}</h3>
              <p className="text-sm text-white/52">
                Ambassador-ready market with strong student identity and repeat trading behavior.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Leaderboards</p>
          <h2 className="font-display text-4xl text-white">Trust becomes visible.</h2>
          <p className="text-white/58">
            City and campus ranking is the retention loop. Monthly resets keep the chase alive,
            while the hall of fame preserves long-term status.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {leaderboards.slice(0, 2).map((leaderboard) => (
            <LeaderboardTable key={leaderboard.city} leaderboard={leaderboard} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <Card className="grid gap-8 rounded-[36px] p-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Premium hooks</p>
            <h2 className="font-display text-4xl text-white">Revenue without breaking the barter loop.</h2>
            <p className="text-white/58">
              Nobody pays to trade. They pay for visibility, identity, and trust signals.
            </p>
            <Link href="/premium">
              <Button>See premium stubs</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {premiumBoostOptions.map((boost) => (
              <div
                className="rounded-[28px] border border-white/8 bg-white/4 p-5"
                key={boost.hours}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Ad Boost</p>
                <p className="mt-3 font-display text-3xl text-white">{boost.label}</p>
                <p className="mt-2 text-sm text-white/55">Top-of-feed visibility window</p>
                <p className="mt-4 text-lg font-semibold text-[#7bff48]">{boost.priceCopy}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
