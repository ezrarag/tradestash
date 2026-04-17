import { NextResponse } from "next/server";

import { createTradeProposal, resolveActor } from "@/lib/data/mutations";
import { tradeProposalSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const actor = await resolveActor({
      authorization: request.headers.get("authorization"),
      demoUserId: request.headers.get("x-demo-user-id"),
    });

    if (!actor) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const input = tradeProposalSchema.parse(await request.json());
    const proposal = await createTradeProposal({
      actor,
      offeredListingId: input.offeredListingId,
      requestedListingId: input.requestedListingId,
    });

    return NextResponse.json({ proposal });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create proposal.",
      },
      { status: 400 },
    );
  }
}
