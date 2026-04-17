import { notFound } from "next/navigation";

import { ListingCard } from "@/components/listings/listing-card";
import { XpBar } from "@/components/profiles/xp-bar";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/ui/tier-badge";
import { getUserProfile } from "@/lib/data/queries";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: { uid: string };
}) {
  const profile = await getUserProfile(params.uid);
  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <Card className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={profile.user.displayName} size="lg" src={profile.user.photoURL} />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Trader profile</p>
              <h1 className="font-display text-4xl text-white">{profile.user.displayName}</h1>
            </div>
          </div>
          <TierBadge
            tier={profile.user.tier}
            verified={profile.user.verifiedBadge === "verified"}
          />
          <p className="text-sm text-white/58">{profile.user.bio}</p>
          <XpBar tier={profile.user.tier} xp={profile.user.xp} />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Completed</p>
              <p className="mt-2 font-display text-3xl text-white">
                {profile.user.completedTrades}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Streak</p>
              <p className="mt-2 font-display text-3xl text-white">
                {profile.user.streakDays} days
              </p>
            </div>
          </div>
          <p className="text-sm text-white/45">
            Last active {formatRelativeTime(profile.user.lastActiveAt)}
          </p>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7bff48]">Current stash</p>
              <h2 className="font-display text-3xl text-white">Active and archived items</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {profile.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7bff48]">Reputation</p>
              <h2 className="font-display text-3xl text-white">Trade reviews</h2>
            </div>
            <div className="space-y-3">
              {profile.reviews.map((review) => (
                <div
                  className="rounded-[24px] border border-white/8 bg-white/4 p-4"
                  key={review.id}
                >
                  <p className="text-sm font-semibold text-white">{review.note}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">
                    {review.rating} • {formatRelativeTime(review.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
