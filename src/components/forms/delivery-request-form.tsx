"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DeliveryRequestForm({ tradeId }: { tradeId: string }) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitRequest() {
    setBusy(true);
    const response = await fetch("/api/delivery-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tradeId,
        pickupLocation,
        dropoffLocation,
        itemDescription,
      }),
    });

    const payload = await response.json();
    setBusy(false);
    setResponseText(response.ok ? JSON.stringify(payload, null, 2) : payload.error);
  }

  return (
    <Card className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Delivery hook</p>
        <h1 className="font-display text-5xl text-white">Request BEAM delivery.</h1>
        <p className="text-white/58">
          This is phase-2 architecture only. The route already returns a mock payload so the
          CTA path is in place after trades are accepted.
        </p>
      </div>

      <div className="grid gap-4">
        <Input onChange={() => void 0} readOnly value={tradeId} />
        <Input
          onChange={(event) => setPickupLocation(event.target.value)}
          placeholder="Pickup location"
          value={pickupLocation}
        />
        <Input
          onChange={(event) => setDropoffLocation(event.target.value)}
          placeholder="Dropoff location"
          value={dropoffLocation}
        />
        <Textarea
          onChange={(event) => setItemDescription(event.target.value)}
          placeholder="Item description"
          value={itemDescription}
        />
        <Button
          disabled={!tradeId || !pickupLocation || !dropoffLocation || !itemDescription || busy}
          onClick={() => void submitRequest()}
        >
          {busy ? "Sending..." : "Request mock delivery"}
        </Button>
      </div>

      {responseText ? (
        <pre className="overflow-x-auto rounded-[24px] border border-white/8 bg-[#0f141d] p-4 text-sm text-white/70">
          {responseText}
        </pre>
      ) : null}
    </Card>
  );
}
