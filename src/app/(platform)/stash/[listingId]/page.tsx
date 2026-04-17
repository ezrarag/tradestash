import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock3, MapPin, Zap } from "lucide-react";

import { TradeProposalForm } from "@/components/forms/trade-proposal-form";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/ui/tier-badge";
import { getListingById } from "@/lib/data/queries";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: { listingId: string };
}) {
  const listing = await getListingById(params.listingId);
  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        <Card className="overflow-hidden p-0">
          <div className="aspect-[4/3]">
            {listing.photos[0] ? (
              <Image
                alt={listing.title}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                src={listing.photos[0]}
              />
            ) : (
              <div className="grid-lines flex h-full items-center justify-center bg-[#0f141d] text-white/35">
                No listing image
              </div>
            )}
          </div>
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
                {listing.category}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
                {listing.condition}
              </span>
              {listing.isLegendBoost ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#7bff48] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#08110b]">
                  <Zap className="h-3 w-3" />
                  Boosted
                </span>
              ) : null}
            </div>
            <div>
              <h1 className="font-display text-5xl text-white">{listing.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/62">
                {listing.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/52">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {listing.location.city}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Posted {formatRelativeTime(listing.createdAt)}
              </span>
            </div>
            <div className="rounded-[28px] border border-white/8 bg-white/4 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Looking for</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {listing.wantInReturnMode === "text"
                  ? listing.wantInReturnText
                  : listing.wantInReturnCategory}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {listing.owner ? (
            <Card className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={listing.owner.displayName} size="lg" src={listing.owner.photoURL} />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Trader</p>
                  <h2 className="font-display text-3xl text-white">
                    {listing.owner.displayName}
                  </h2>
                </div>
              </div>
              <TierBadge
                tier={listing.owner.tier}
                verified={listing.owner.verifiedBadge === "verified"}
              />
              <p className="text-sm text-white/58">{listing.owner.bio}</p>
            </Card>
          ) : null}

          <TradeProposalForm
            requestedListingId={listing.id}
            requestedOwnerId={listing.userId}
          />
        </div>
      </div>
    </div>
  );
}
