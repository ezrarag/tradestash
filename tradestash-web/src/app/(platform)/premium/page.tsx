import { Check, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { premiumBoostOptions } from "@/lib/constants";

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Premium stubs</p>
        <h1 className="font-display text-5xl text-white">Trust and visibility, not pay-to-win.</h1>
        <p className="text-white/58">
          Revenue comes from verified status, cosmetic identity, and temporary search boosts.
          Trades themselves stay money-free.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr,1fr]">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#7bff48]" />
            <h2 className="font-display text-3xl text-white">Verified badge</h2>
          </div>
          <p className="text-white/58">
            Manual review or ID-gated flow. Stored as a Firestore profile flag so the mobile app
            can render the same trust signal later.
          </p>
          <div className="space-y-3">
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <p className="text-sm font-semibold text-white">Monthly plan</p>
              <p className="mt-2 text-white/58">$5.99 / month placeholder</p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
              <p className="text-sm font-semibold text-white">One-time verification</p>
              <p className="mt-2 text-white/58">$14.99 placeholder</p>
            </div>
          </div>
          <Button>Apply for verification</Button>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#ff6a00]" />
            <h2 className="font-display text-3xl text-white">Ad Boost</h2>
          </div>
          <p className="text-white/58">
            Listings get temporarily pinned to the top of browse results. Legend tier still gets
            auto-boosted without payment.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {premiumBoostOptions.map((option) => (
              <div
                className="rounded-[24px] border border-white/8 bg-white/4 p-4"
                key={option.hours}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {option.label}
                </p>
                <p className="mt-3 font-display text-3xl text-white">{option.priceCopy}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/4 p-4">
            <p className="text-sm font-semibold text-white">Legend perk</p>
            <p className="mt-2 text-white/58">
              Legends always rank first in their city feed when their listing is still active.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#7bff48]" />
                Tier-based perk, not a purchase
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#7bff48]" />
                Reinforces repeat trading
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
