import { notFound } from "next/navigation";

import { TradeThread } from "@/components/trades/trade-thread";
import { getTradeProposalById } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function TradeThreadPage({
  params,
}: {
  params: { proposalId: string };
}) {
  const proposal = await getTradeProposalById(params.proposalId);
  if (!proposal) {
    notFound();
  }

  return <TradeThread initialProposal={proposal} />;
}
