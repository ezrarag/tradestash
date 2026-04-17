"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listingCategories, listingConditions } from "@/lib/constants";

const blankPhotos = ["", "", "", ""];

export function ListingForm() {
  const router = useRouter();
  const { getAuthHeaders, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: listingCategories[0],
    condition: listingConditions[1],
    photos: blankPhotos,
    city: "",
    zipCode: "",
    campus: "",
    lat: "",
    lng: "",
    wantInReturnMode: "text",
    wantInReturnText: "",
    wantInReturnCategory: listingCategories[0],
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await getAuthHeaders()),
        },
        body: JSON.stringify({
          ...form,
          lat: form.lat ? Number(form.lat) : undefined,
          lng: form.lng ? Number(form.lng) : undefined,
          photos: form.photos.filter(Boolean),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to publish listing.");
      }

      router.push(`/stash/${payload.listing.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to publish listing.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-[#7bff48]">Stash post</p>
        <h1 className="font-display text-4xl text-white">Post what you’re ready to trade.</h1>
        <p className="max-w-2xl text-sm text-white/62">
          Keep it clean, specific, and campus-friendly. MVP uses photo URLs for now so the
          web app stays Firebase-ready without blocking on Storage setup.
        </p>
      </div>

      {!user ? (
        <div className="rounded-[24px] border border-[#ff6a00]/25 bg-[#ff6a00]/10 p-4 text-sm text-[#ffcfaa]">
          Sign in first. In demo mode, any demo persona can post immediately.
        </div>
      ) : null}

      <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-4 lg:col-span-2">
          <Input
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Title"
            required
            value={form.title}
          />
          <Textarea
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            placeholder="Describe what it is, what's included, and why somebody should want it."
            required
            value={form.description}
          />
        </div>

        <Select
          onChange={(event) =>
            setForm((current) => ({ ...current, category: event.target.value as typeof form.category }))
          }
          value={form.category}
        >
          {listingCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              condition: event.target.value as typeof form.condition,
            }))
          }
          value={form.condition}
        >
          {listingConditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </Select>

        <Input
          onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
          placeholder="City"
          required
          value={form.city}
        />

        <Input
          onChange={(event) => setForm((current) => ({ ...current, zipCode: event.target.value }))}
          placeholder="ZIP code"
          value={form.zipCode}
        />

        <Input
          onChange={(event) => setForm((current) => ({ ...current, campus: event.target.value }))}
          placeholder="Campus (optional)"
          value={form.campus}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            onChange={(event) => setForm((current) => ({ ...current, lat: event.target.value }))}
            placeholder="Latitude"
            value={form.lat}
          />
          <Input
            onChange={(event) => setForm((current) => ({ ...current, lng: event.target.value }))}
            placeholder="Longitude"
            value={form.lng}
          />
        </div>

        <div className="space-y-3 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Photo URLs</p>
          <div className="grid gap-3 md:grid-cols-2">
            {form.photos.map((photo, index) => (
              <Input
                key={index}
                onChange={(event) =>
                  setForm((current) => {
                    const nextPhotos = [...current.photos];
                    nextPhotos[index] = event.target.value;
                    return { ...current, photos: nextPhotos };
                  })
                }
                placeholder={`Photo URL ${index + 1}`}
                value={photo}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <Button
              className={form.wantInReturnMode === "text" ? "" : "opacity-70"}
              onClick={() =>
                setForm((current) => ({ ...current, wantInReturnMode: "text" }))
              }
              type="button"
              variant={form.wantInReturnMode === "text" ? "primary" : "secondary"}
            >
              Open text
            </Button>
            <Button
              className={form.wantInReturnMode === "category" ? "" : "opacity-70"}
              onClick={() =>
                setForm((current) => ({ ...current, wantInReturnMode: "category" }))
              }
              type="button"
              variant={form.wantInReturnMode === "category" ? "primary" : "secondary"}
            >
              Category target
            </Button>
          </div>
          {form.wantInReturnMode === "text" ? (
            <Input
              onChange={(event) =>
                setForm((current) => ({ ...current, wantInReturnText: event.target.value }))
              }
              placeholder="What do you want back?"
              value={form.wantInReturnText}
            />
          ) : (
            <Select
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  wantInReturnCategory: event.target.value as typeof form.wantInReturnCategory,
                }))
              }
              value={form.wantInReturnCategory}
            >
              {listingCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          )}
        </div>

        {error ? (
          <p className="lg:col-span-2 rounded-2xl border border-[#ff6a00]/25 bg-[#ff6a00]/10 p-4 text-sm text-[#ffcfaa]">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-3 lg:col-span-2">
          <Button disabled={submitting || !user} type="submit">
            {submitting ? "Publishing..." : "Publish stash post"}
          </Button>
          <p className="text-sm text-white/45">
            Want a paid bump later? Ad Boost packages live on the premium page.
          </p>
        </div>
      </form>
    </Card>
  );
}
