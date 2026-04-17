import { NextResponse } from "next/server";

import { appendTradeMessage, resolveActor } from "@/lib/data/mutations";
import { messageSchema } from "@/lib/validators";

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

    const input = messageSchema.parse(await request.json());
    const message = await appendTradeMessage({
      actor,
      proposalId: params.proposalId,
      body: input.body,
    });

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to send message.",
      },
      { status: 400 },
    );
  }
}
