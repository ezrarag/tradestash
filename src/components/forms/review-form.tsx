"use client";

import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({
  toUserId,
  tradeId,
}: {
  toUserId: string;
  tradeId: string;
}) {
  const { getAuthHeaders, user } = useAuth();
  const [rating, setRating] = useState<"thumbUp" | "thumbDown">("thumbUp");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!user) {
    return null;
  }

  async function submitReview() {
    setBusy(true);
    setStatus(null);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        tradeId,
        toUserId,
        rating,
        note,
      }),
    });

    const payload = await response.json();
    setBusy(false);
    setStatus(response.ok ? "Review posted." : payload.error ?? "Unable to post review.");
    if (response.ok) {
      setNote("");
    }
  }

  return (
    <div className="space-y-3 rounded-[24px] border border-white/8 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Leave feedback</p>
      <div className="grid gap-3 md:grid-cols-[180px,1fr]">
        <Select onChange={(event) => setRating(event.target.value as typeof rating)} value={rating}>
          <option value="thumbUp">Thumb up</option>
          <option value="thumbDown">Thumb down</option>
        </Select>
        <Textarea
          onChange={(event) => setNote(event.target.value)}
          placeholder="How did the trade go?"
          value={note}
        />
      </div>
      {status ? <p className="text-sm text-white/55">{status}</p> : null}
      <Button disabled={!note || busy} onClick={() => void submitReview()}>
        {busy ? "Posting..." : "Post review"}
      </Button>
    </div>
  );
}
