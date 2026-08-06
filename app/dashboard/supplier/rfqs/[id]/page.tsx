import { getServerSession } from "@/app/lib/get-session";
import prisma from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SubmitQuoteForm from "./submit-quote-form";

const SupplierRfqDetailPage = async ({
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
    include: { buyer: true },
  });

  if (!rfq) {
    notFound();
  }

  const existingQuote = await prisma.quote.findFirst({
    where: { rfqId: rfq.id, supplierId: session.user.id },
  });

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-gray-100 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{rfq.product}</h1>
          <Link href={`/dashboard/messages/${rfq.id}/${session.user.id}`}>
            <button className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50">
              Negotiate with buyer
            </button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {rfq.quantity} {rfq.unit} · {rfq.category}
        </p>
        <p className="text-sm text-gray-500">
          Buyer: {rfq.buyer.businessName || rfq.buyer.name}
        </p>
        {rfq.notes && <p className="text-sm text-gray-600 mt-3">{rfq.notes}</p>}
      </div>

      {existingQuote ? (
        <div className="bg-white border border-gray-100 rounded-lg p-5">
          <p className="text-sm font-medium mb-1">You already quoted this RFQ</p>
          <p className="text-sm text-gray-500">
            ₦{existingQuote.price.toLocaleString()} · {existingQuote.deliveryDays} days ·{" "}
            <span className="font-medium">{existingQuote.status}</span>
          </p>
        </div>
      ) : (
        <SubmitQuoteForm rfqId={rfq.id} />
      )}
    </div>
  );
};

export default SupplierRfqDetailPage;