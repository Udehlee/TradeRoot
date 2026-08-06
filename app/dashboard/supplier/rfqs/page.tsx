import { getServerSession } from "@/app/lib/get-session";
import  prisma  from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Incoming RFQs | TradeRoot",
};

const IncomingRfqsPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const supplierId = session.user.id;
  const category = session.user.category ?? undefined;

  const rfqs = await prisma.rfq.findMany({
    where: {
      category,
      status: { in: ["OPEN", "QUOTED"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      buyer: true,
      quotes: {
        where: { supplierId },
        select: { id: true, status: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Incoming RFQs</h1>
      <p className="text-sm text-gray-500 mb-6">
        Matching your category: {session.user.category ?? "Not set"}
      </p>

      {rfqs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">
            No open RFQs matching your category right now.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          {rfqs.map((rfq, i) => {
            const alreadyQuoted = rfq.quotes.length > 0;

            return (
              <Link
                key={rfq.id}
                href={`/dashboard/supplier/rfqs/${rfq.id}`}
                className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 ${
                  i !== rfqs.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div>
                  <p className="font-medium">{rfq.product}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {rfq.quantity} {rfq.unit} · {rfq.buyer.businessName || rfq.buyer.name}
                  </p>
                </div>

                {alreadyQuoted ? (
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                    Quoted — {rfq.quotes[0].status}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs bg-red-50 text-red-600">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncomingRfqsPage;