import { DeliveryRequestForm } from "@/components/forms/delivery-request-form";

export default function DeliveryPage({
  searchParams,
}: {
  searchParams?: { tradeId?: string };
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <DeliveryRequestForm tradeId={searchParams?.tradeId ?? ""} />
    </div>
  );
}
