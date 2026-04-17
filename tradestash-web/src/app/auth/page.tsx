"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDemoStore } from "@/lib/demo-store";

export default function AuthPage() {
  const router = useRouter();
  const { actAsDemoUser, demoMode, getAuthHeaders, signIn, signUp } = useAuth();
  const [registering, setRegistering] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [campus, setCampus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function bootstrapProfile(nextDisplayName: string, nextEmail: string) {
    await fetch("/api/users/bootstrap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        displayName: nextDisplayName,
        email: nextEmail,
        city: city || "Washington, DC",
        campus,
      }),
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    try {
      if (registering) {
        await signUp({ displayName, email, password });
        await bootstrapProfile(displayName, email);
      } else {
        await signIn(email, password);
        await bootstrapProfile(displayName || email.split("@")[0], email);
      }

      router.push("/trades");
    } catch (authError) {
      setStatus(authError instanceof Error ? authError.message : "Auth failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <Card className="space-y-5">
          <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Access</p>
          <h1 className="font-display text-5xl text-white">
            {registering ? "Create your trader profile." : "Sign back into your stash."}
          </h1>
          <p className="text-white/58">
            Firebase Auth is wired with environment variables. If those aren’t present, the app
            drops into demo mode so the rest of the product is still explorable.
          </p>
          {demoMode ? (
            <div className="space-y-3 rounded-[24px] border border-[#ff6a00]/25 bg-[#ff6a00]/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#ffcfaa]">Demo personas</p>
              <div className="grid gap-2">
                {getDemoStore().users.map((user) => (
                  <button
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:border-[#7bff48]/20"
                    key={user.id}
                    onClick={() => {
                      actAsDemoUser(user.id);
                      router.push("/trades");
                    }}
                  >
                    {user.displayName} • {user.tier}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-5">
          <div className="flex gap-2">
            <Button
              onClick={() => setRegistering(true)}
              variant={registering ? "primary" : "secondary"}
            >
              Register
            </Button>
            <Button
              onClick={() => setRegistering(false)}
              variant={!registering ? "primary" : "secondary"}
            >
              Sign in
            </Button>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {registering ? (
              <Input
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Display name"
                required
                value={displayName}
              />
            ) : null}
            <Input
              onChange={(event) => setCity(event.target.value)}
              placeholder="City"
              value={city}
            />
            <Input
              onChange={(event) => setCampus(event.target.value)}
              placeholder="Campus"
              value={campus}
            />
            <Input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              type="email"
              value={email}
            />
            <Input
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
              type="password"
              value={password}
            />
            {status ? <p className="text-sm text-[#ffcfaa]">{status}</p> : null}
            <Button disabled={busy} type="submit">
              {busy ? "Working..." : registering ? "Create account" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
