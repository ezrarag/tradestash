"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { ListingWithOwner } from "@/lib/types";

type DashboardPayload = {
  activeListings: ListingWithOwner[];
};

export function TradeProposalForm({
  requestedListingId,
  requestedOwnerId,
}: {
  requestedListingId: string;
  requestedOwnerId: string;
}) {
  const { getAuthHeaders, loading, user } = useAuth();
  const [listings, setListings] = useState<ListingWithOwner[]>([]);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!user || user.id === requestedOwnerId) {
        return;
      }

      const response = await fetch("/api/me/dashboard", {
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as DashboardPayload;
      setListings(payload.activeListings.filter((listing) => listing.status === "active"));
    }

    void loadDashboard();
  }, [getAuthHeaders, requestedOwnerId, user]);

  async function submitProposal() {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/trade-proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({
          offeredListingId: selectedListingId,
          requestedListingId,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send proposal.");
      }

      setMessage("Proposal sent. The trade thread is now live.");
      setSelectedListingId("");
    } catch (proposalError) {
      setError(
        proposalError instanceof Error ? proposalError.message : "Unable to send proposal.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Card className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-[#7bff48]">Trade flow</p>
        <h3 className="font-display text-2xl text-white">Sign in to make an offer.</h3>
        <p className="text-sm text-white/55">
          Demo mode lets you switch personas from the header and test the trade loop immediately.
        </p>
        <Link href="/auth">
          <Button>Go to auth</Button>
        </Link>
      </Card>
    );
  }

  if (user.id === requestedOwnerId) {
    return (
      <Card className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-[#7bff48]">Your post</p>
        <h3 className="font-display text-2xl text-white">This listing belongs to you.</h3>
        <p className="text-sm text-white/55">
          Head to your stash to manage boosts, status, or premium features.
        </p>
        <Link href={`/profile/${user.id}`}>
          <Button variant="secondary">Open profile</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#7bff48]">Trade proposal</p>
        <h3 className="font-display text-2xl text-white">Offer one of your active items.</h3>
      </div>

      <Select onChange={(event) => setSelectedListingId(event.target.value)} value={selectedListingId}>
        <option value="">Choose your item</option>
        {listings.map((listing) => (
          <option key={listing.id} value={listing.id}>
            {listing.title}
          </option>
        ))}
      </Select>

      {error ? (
        <p className="rounded-2xl border border-[#ff6a00]/25 bg-[#ff6a00]/10 p-4 text-sm text-[#ffcfaa]">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-2xl border border-[#7bff48]/25 bg-[#7bff48]/10 p-4 text-sm text-[#c7ffb4]">
          {message}
        </p>
      ) : null}

      <Button disabled={!selectedListingId || busy} onClick={() => void submitProposal()}>
        {busy ? "Sending..." : "Send trade proposal"}
      </Button>
    </Card>
  );
}
