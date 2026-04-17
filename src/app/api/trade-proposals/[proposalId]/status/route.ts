import { NextResponse } from "next/server";
import { z } from "zod";

import { resolveActor, updateTradeProposalStatus } from "@/lib/data/mutations";

const statusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed"]),
});

export async function POST(
  request: Request,
  { params }: { params: { proposalId: string } },
) {
  try {
    const actor = await resolveActor({
      authorization: request.headers.get("authorization"),
      demoUserId: request.headers.get("x-demo-user-id"),
    });

    if (!actor) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const payload = statusSchema.parse(await request.json());
    const proposal = await updateTradeProposalStatus({
      actor,
      proposalId: params.proposalId,
      status: payload.status,
    });

    return NextResponse.json({ proposal });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to update proposal.",
      },
      { status: 400 },
    );
  }
}
