import { getServerSession } from "@/app/lib/get-session";
import  prisma  from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import AwardQuoteButton from "./award-quote-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RfqDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const rfq = await prisma.rfq.findUnique({
    where: { id },
    include: {
      quotes: {
        include: {
          supplier: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!rfq || rfq.buyerId !== session.user.id) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-gray-100 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold">{rfq.product}</h1>

          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
            {rfq.status}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          {rfq.quantity} {rfq.unit} · {rfq.category}
        </p>

        {rfq.notes && (
          <p className="text-sm text-gray-600 mt-3">{rfq.notes}</p>
        )}
      </div>

      <h2 className="text-sm font-medium mb-3">
        Quotes received ({rfq.quotes.length})
      </h2>

      {rfq.quotes.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">
            No quotes yet — suppliers matching this category will be notified.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rfq.quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">
                  {quote.supplier.businessName || quote.supplier.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  ₦{quote.price.toLocaleString()} · {quote.deliveryDays} day
                  delivery
                </p>

                {quote.message && (
                  <p className="text-xs text-gray-400 mt-1">
                    {quote.message}
                  </p>
                )}

                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                    quote.status === "ACCEPTED"
                      ? "bg-green-50 text-green-700"
                      : quote.status === "REJECTED"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {quote.status}
                </span>
              </div>

              <div className="flex gap-2">
                <Link href={`/dashboard/messages/${rfq.id}/${quote.supplierId}`}>
                  <button className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
                    Negotiate
                  </button>
                </Link>

                {(rfq.status === "OPEN" ||
                  rfq.status === "QUOTED") && (
                  <AwardQuoteButton
                    rfqId={rfq.id}
                    quoteId={quote.id}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RfqDetailPage;