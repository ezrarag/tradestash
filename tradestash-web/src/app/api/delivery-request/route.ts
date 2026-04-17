import { NextResponse } from "next/server";

import { markDeliveryRequested } from "@/lib/data/mutations";
import { deliveryRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = deliveryRequestSchema.parse(await request.json());
    await markDeliveryRequested(input.tradeId);

    return NextResponse.json({
      ok: true,
      provider: "BEAM Transportation",
      requestId: `beam-${Date.now().toString(36)}`,
      status: "queued",
      submittedAt: new Date().toISOString(),
      request: input,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to request delivery.",
      },
      { status: 400 },
    );
  }
}
