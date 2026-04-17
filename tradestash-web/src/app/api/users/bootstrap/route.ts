import { NextResponse } from "next/server";

import { bootstrapUserRecord, resolveActor } from "@/lib/data/mutations";
import { bootstrapUserSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const actor = await resolveActor({
      authorization: request.headers.get("authorization"),
      demoUserId: request.headers.get("x-demo-user-id"),
    });

    if (!actor) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const input = bootstrapUserSchema.parse(await request.json());
    const user = await bootstrapUserRecord({
      actor: {
        ...actor,
        displayName: input.displayName || actor.displayName,
        email: input.email || actor.email,
      },
      city: input.city,
      campus: input.campus || undefined,
      photoURL: input.photoURL || undefined,
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to bootstrap profile.",
      },
      { status: 400 },
    );
  }
}
