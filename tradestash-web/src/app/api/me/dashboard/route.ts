import { NextResponse } from "next/server";

import { resolveActor } from "@/lib/data/mutations";
import { getDashboardForUser } from "@/lib/data/queries";

export async function GET(request: Request) {
  try {
    const actor = await resolveActor({
      authorization: request.headers.get("authorization"),
      demoUserId: request.headers.get("x-demo-user-id"),
    });

    if (!actor) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const dashboard = await getDashboardForUser(actor.id);
    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load dashboard.",
      },
      { status: 400 },
    );
  }
}
