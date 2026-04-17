import { Search } from "lucide-react";

import { ListingCard } from "@/components/listings/listing-card";
import { Card } from "@/components/ui/card";
import { leaderboardCities, listingCategories } from "@/lib/constants";
import { getListings } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    category?: string;
    city?: string;
  };
}) {
  const listings = await getListings({
    query: searchParams?.q,
    category: searchParams?.category,
    city: searchParams?.city,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Browse</p>
        <h1 className="font-display text-5xl text-white">Find the right trade.</h1>
        <p className="max-w-2xl text-white/58">
          MVP search is built for relevance first: title, description, and category tokens all
          count, so typing “iPad” surfaces electronics without the old Bubble failure mode.
        </p>
      </div>

      <Card className="mb-8">
        <form className="grid gap-4 lg:grid-cols-[1.5fr,1fr,1fr,auto]">
          <label className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-[#0f141d] px-4">
            <Search className="h-4 w-4 text-white/35" />
            <input
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              defaultValue={searchParams?.q}
              name="q"
              placeholder="Search by item name, type, or keyword"
            />
          </label>
          <select
            className="h-12 rounded-[24px] border border-white/10 bg-[#0f141d] px-4 text-sm text-white"
            defaultValue={searchParams?.category ?? "All"}
            name="category"
          >
            <option value="All">All categories</option>
            {listingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="h-12 rounded-[24px] border border-white/10 bg-[#0f141d] px-4 text-sm text-white"
            defaultValue={searchParams?.city ?? ""}
            name="city"
          >
            <option value="">All cities</option>
            {leaderboardCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <button className="h-12 rounded-full bg-[#7bff48] px-5 text-sm font-semibold text-[#08110b]">
            Filter
          </button>
        </form>
      </Card>

      <div className="mb-6 flex items-center justify-between text-sm text-white/45">
        <p>{listings.length} listings matched</p>
        <p>Boosted and Legend posts rank first.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
