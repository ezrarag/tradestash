"use client";

import Link from "next/link";
import { BellRing, MessageSquare, Package2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { XpBar } from "@/components/profiles/xp-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/ui/tier-badge";
import { formatRelativeTime } from "@/lib/utils";
import type { UserDashboard } from "@/lib/types";

const statusCopy = {
  pending: "border-[#ffb000]/25 bg-[#ffb000]/10 text-[#ffd46d]",
  accepted: "border-[#7bff48]/25 bg-[#7bff48]/10 text-[#b4ff88]",
  rejected: "border-[#ff6a00]/25 bg-[#ff6a00]/10 text-[#ffb27a]",
  completed: "border-[#59c4ff]/25 bg-[#59c4ff]/10 text-[#8cd8ff]",
} as const;

export function TradeDashboard() {
  const { getAuthHeaders, user } = useAuth();
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch("/api/me/dashboard", {
        headers: await getAuthHeaders(),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load dashboard.");
      }
      setDashboard(payload);
      setError(null);
    } catch (dashboardError) {
      setError(
        dashboardError instanceof Error
          ? dashboardError.message
          : "Unable to load dashboard.",
      );
    }
  }, [getAuthHeaders, user]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function updateStatus(proposalId: string, status: "accepted" | "rejected" | "completed") {
    const response = await fetch(`/api/trade-proposals/${proposalId}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      void loadDashboard();
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Card className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Trades</p>
          <h1 className="font-display text-4xl text-white">Sign in to open your trade inbox.</h1>
          <p className="text-sm text-white/55">
            This screen pulls your listings, proposal threads, and notifications into one place.
          </p>
          <Link href="/auth">
            <Button>Go to auth</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm text-white/55">{error ?? "Loading dashboard..."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[360px,1fr]">
      <Card className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Your profile</p>
          <h1 className="font-display text-3xl text-white">{dashboard.user.displayName}</h1>
          <TierBadge
            tier={dashboard.user.tier}
            verified={dashboard.user.verifiedBadge === "verified"}
          />
        </div>
        <XpBar tier={dashboard.user.tier} xp={dashboard.user.xp} />

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Active listings</p>
            <p className="mt-2 font-display text-3xl text-white">
              {dashboard.activeListings.length}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Unread cues</p>
            <p className="mt-2 font-display text-3xl text-white">
              {dashboard.notifications.filter((entry) => !entry.read).length}
            </p>
          </div>
        </div>

        <Link href={`/profile/${dashboard.user.id}`}>
          <Button variant="secondary">Open public profile</Button>
        </Link>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <Package2 className="h-5 w-5 text-[#7bff48]" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Your stash</p>
              <h2 className="font-display text-2xl text-white">Current items</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {dashboard.activeListings.map((listing) => (
              <Link
                className="rounded-[24px] border border-white/8 bg-white/4 p-4 transition hover:border-[#7bff48]/20"
                href={`/stash/${listing.id}`}
                key={listing.id}
              >
                <p className="text-sm font-semibold text-white">{listing.title}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">
                  {listing.category} • {listing.status}
                </p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-[#7bff48]" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Trade threads</p>
              <h2 className="font-display text-2xl text-white">Pending and completed</h2>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard.proposals.map((proposal) => (
              <div
                className="rounded-[24px] border border-white/8 bg-white/4 p-4"
                key={proposal.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      {proposal.offeredListing?.title} → {proposal.requestedListing?.title}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {proposal.offerer?.displayName} ↔ {proposal.receiver?.displayName}
                    </p>
                    <p className="mt-2 text-sm text-white/55">
                      Last updated {formatRelativeTime(proposal.updatedAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusCopy[proposal.status]}`}
                  >
                    {proposal.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/trades/${proposal.id}`}>
                    <Button variant="secondary">Open thread</Button>
                  </Link>
                  {proposal.status === "pending" ? (
                    <>
                      <Button onClick={() => void updateStatus(proposal.id, "accepted")}>
                        Accept
                      </Button>
                      <Button
                        onClick={() => void updateStatus(proposal.id, "rejected")}
                        variant="secondary"
                      >
                        Reject
                      </Button>
                    </>
                  ) : null}
                  {proposal.status === "accepted" ? (
                    <Button onClick={() => void updateStatus(proposal.id, "completed")}>
                      Complete trade
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-[#7bff48]" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">Notifications</p>
              <h2 className="font-display text-2xl text-white">Async nudges</h2>
            </div>
          </div>
          <div className="space-y-3">
            {dashboard.notifications.map((notification) => (
              <Link
                className="block rounded-[24px] border border-white/8 bg-white/4 p-4 transition hover:border-[#7bff48]/20"
                href={notification.link}
                key={notification.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-sm text-white/55">{notification.body}</p>
                  </div>
                  {!notification.read ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#7bff48]" />
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
