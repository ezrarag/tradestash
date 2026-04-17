"use client";

import Link from "next/link";
import { Menu, ShieldCheck, Trophy } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/ui/tier-badge";
import { getDemoStore } from "@/lib/demo-store";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/stash/new", label: "Post" },
  { href: "/trades", label: "Trades" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/premium", label: "Premium" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { demoMode, user, signOut, actAsDemoUser } = useAuth();
  const demoUsers = getDemoStore().users;
  const matchedDemoUser = demoUsers.find((entry) => entry.id === user?.id);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#090d13]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7bff48,#ff6a00)] font-black text-[#08110b]">
              TS
            </div>
            <div>
              <p className="font-display text-xl tracking-[0.08em] text-white">
                TradeStash
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/35">
                Stop buying. Start trading.
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <Link
                className="rounded-full px-3 py-2 text-sm text-white/65 transition hover:bg-white/6 hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {demoMode && (
            <div className="flex items-center gap-2 rounded-full border border-[#ff6a00]/25 bg-[#ff6a00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#ffb27a]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Demo mode
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href={`/profile/${user.id}`}>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
                  <Avatar name={user.displayName} size="sm" src={user.photoURL} />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.displayName}</p>
                    {matchedDemoUser ? (
                      <TierBadge
                        className="border-none bg-transparent px-0 py-0 text-[10px]"
                        tier={matchedDemoUser.tier}
                        verified={matchedDemoUser.verifiedBadge === "verified"}
                      />
                    ) : null}
                  </div>
                </div>
              </Link>
              <Button onClick={() => void signOut()} variant="ghost">
                Sign out
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>

        <button
          aria-label="Open navigation"
          className="inline-flex rounded-full border border-white/10 p-2 text-white md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen ? (
        <div className="mx-auto max-w-7xl px-6 pb-5 md:hidden">
          <Card className="space-y-4 rounded-[24px]">
            <div className="grid gap-2">
              {navLinks.map((item) => (
                <Link
                  className="rounded-2xl px-3 py-2 text-white/75 hover:bg-white/6 hover:text-white"
                  href={item.href}
                  key={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {demoMode ? (
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/40">
                  <Trophy className="h-3.5 w-3.5" />
                  Demo personas
                </p>
                <div className="grid gap-2">
                  {demoUsers.map((demoUser) => (
                    <button
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-3 py-2 text-left"
                      key={demoUser.id}
                      onClick={() => {
                        actAsDemoUser(demoUser.id);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="text-sm text-white">{demoUser.displayName}</span>
                      <TierBadge tier={demoUser.tier} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      ) : null}
    </header>
  );
}
