"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ReviewForm } from "@/components/forms/review-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/utils";
import type { TradeProposalWithContext } from "@/lib/types";

export function TradeThread({
  initialProposal,
}: {
  initialProposal: TradeProposalWithContext;
}) {
  const { getAuthHeaders, user } = useAuth();
  const [proposal, setProposal] = useState(initialProposal);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function changeStatus(nextStatus: "accepted" | "rejected" | "completed") {
    setBusy(true);
    const response = await fetch(`/api/trade-proposals/${proposal.id}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    const payload = await response.json();
    setBusy(false);

    if (response.ok) {
      setProposal(payload.proposal);
      setStatus(`Trade marked ${nextStatus}.`);
    } else {
      setStatus(payload.error ?? "Unable to update trade.");
    }
  }

  async function sendMessage() {
    setBusy(true);
    const response = await fetch(`/api/trade-proposals/${proposal.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({ body }),
    });
    const payload = await response.json();
    setBusy(false);

    if (response.ok) {
      setProposal((current) => ({
        ...current,
        messages: [...(current.messages ?? []), payload.message],
      }));
      setBody("");
      setStatus("Message sent.");
    } else {
      setStatus(payload.error ?? "Unable to send message.");
    }
  }

  const counterpartId =
    user?.id === proposal.offererId ? proposal.receiverId : proposal.offererId;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[380px,1fr]">
      <Card className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Trade context</p>
          <h1 className="font-display text-3xl text-white">
            {proposal.offeredListing?.title} ↔ {proposal.requestedListing?.title}
          </h1>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Status</p>
          <p className="mt-2 text-xl font-semibold text-white">{proposal.status}</p>
          <p className="mt-2 text-sm text-white/55">
            Updated {formatRelativeTime(proposal.updatedAt)}
          </p>
        </div>

        <div className="space-y-3">
          {proposal.status === "pending" ? (
            <>
              <Button disabled={busy} onClick={() => void changeStatus("accepted")}>
                Accept
              </Button>
              <Button
                disabled={busy}
                onClick={() => void changeStatus("rejected")}
                variant="secondary"
              >
                Reject
              </Button>
            </>
          ) : null}
          {proposal.status === "accepted" ? (
            <>
              <Button disabled={busy} onClick={() => void changeStatus("completed")}>
                Confirm completed trade
              </Button>
              <Link href={`/delivery?tradeId=${proposal.id}`}>
                <Button variant="secondary">Arrange delivery</Button>
              </Link>
            </>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Participants</p>
          <p className="mt-2 text-sm text-white">
            {proposal.offerer?.displayName} and {proposal.receiver?.displayName}
          </p>
        </div>

        {proposal.status === "completed" && counterpartId ? (
          <ReviewForm toUserId={counterpartId} tradeId={proposal.id} />
        ) : null}
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Async messaging</p>
          <h2 className="font-display text-3xl text-white">Thread</h2>
        </div>

        <div className="space-y-3">
          {(proposal.messages ?? []).map((message) => {
            const mine = message.senderId === user?.id;
            return (
              <div
                className={`max-w-[85%] rounded-[24px] px-4 py-3 ${
                  mine
                    ? "ml-auto bg-[#7bff48] text-[#08110b]"
                    : "border border-white/8 bg-white/5 text-white"
                }`}
                key={message.id}
              >
                <p className="text-sm">{message.body}</p>
                <p
                  className={`mt-2 text-xs ${
                    mine ? "text-[#0d1b0f]/70" : "text-white/45"
                  }`}
                >
                  {formatRelativeTime(message.createdAt)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 rounded-[24px] border border-white/8 bg-white/4 p-4">
          <Textarea
            onChange={(event) => setBody(event.target.value)}
            placeholder="Send a message, lock a meetup, or ask for delivery details."
            value={body}
          />
          {status ? <p className="text-sm text-white/55">{status}</p> : null}
          <Button disabled={!body || busy || !user} onClick={() => void sendMessage()}>
            {busy ? "Sending..." : "Send message"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
