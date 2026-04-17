import { NextResponse } from "next/server";

import { createListing, resolveActor } from "@/lib/data/mutations";
import { listingSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const actor = await resolveActor({
      authorization: request.headers.get("authorization"),
      demoUserId: request.headers.get("x-demo-user-id"),
    });

    if (!actor) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const payload = await request.json();
    const input = listingSchema.parse(payload);
    const listing = await createListing({
      actor,
      input,
    });

    return NextResponse.json({ listing });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create listing.",
      },
      { status: 400 },
    );
  }
}
