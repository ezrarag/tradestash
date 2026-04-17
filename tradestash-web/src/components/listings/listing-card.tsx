import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/ui/tier-badge";
import { formatRelativeTime } from "@/lib/utils";
import type { ListingWithOwner } from "@/lib/types";

export function ListingCard({
  listing,
  href = `/stash/${listing.id}`,
}: {
  listing: ListingWithOwner;
  href?: string;
}) {
  return (
    <Link href={href}>
      <Card className="group h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:border-[#7bff48]/20">
        <div className="relative aspect-[4/3] overflow-hidden">
          {listing.photos[0] ? (
            <Image
              alt={listing.title}
              className="object-cover transition duration-500 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={listing.photos[0]}
            />
          ) : (
            <div className="grid-lines flex h-full items-center justify-center bg-[#0f141d] text-white/35">
              No image
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/75">
              {listing.category}
            </span>
            {listing.isLegendBoost ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#7bff48] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#08110b]">
                <Sparkles className="h-3 w-3" />
                Boosted
              </span>
            ) : null}
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl text-white">{listing.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-white/62">
                {listing.description}
              </p>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 text-white/35 transition group-hover:text-[#7bff48]" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/40">
            <span className="rounded-full border border-white/10 px-3 py-1">
              {listing.condition}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location.city}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-3.5 w-3.5" />
              {formatRelativeTime(listing.createdAt)}
            </span>
          </div>

          {listing.owner ? (
            <div className="flex items-center justify-between rounded-[20px] border border-white/8 bg-white/4 px-3 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={listing.owner.displayName} size="sm" src={listing.owner.photoURL} />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {listing.owner.displayName}
                  </p>
                  <p className="text-xs text-white/45">
                    {listing.owner.campus ?? listing.owner.city}
                  </p>
                </div>
              </div>
              <TierBadge
                tier={listing.owner.tier}
                verified={listing.owner.verifiedBadge === "verified"}
              />
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
