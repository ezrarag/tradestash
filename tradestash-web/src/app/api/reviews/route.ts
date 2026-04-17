import { NextResponse } from "next/server";

import { createReview, resolveActor } from "@/lib/data/mutations";
import { reviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const actor = await resolveActor({
      authorization: request.headers.get("authorization"),
      demoUserId: request.headers.get("x-demo-user-id"),
    });

    if (!actor) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const input = reviewSchema.parse(await request.json());
    const review = await createReview({
      actor,
      tradeId: input.tradeId,
      toUserId: input.toUserId,
      rating: input.rating,
      note: input.note,
    });

    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create review.",
      },
      { status: 400 },
    );
  }
}
