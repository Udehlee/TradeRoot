import { getServerSession } from "@/app/lib/get-session";
import  prisma  from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supplier Dashboard | TradeRoot",
};

const SupplierDashboard = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const supplierId = session.user.id;
  const category = session.user.category ?? undefined;

  const [newRfqs, quotesSent, toFulfill, totalQuotes, acceptedQuotes, incomingRfqs] =
    await Promise.all([
      prisma.rfq.count({
        where: { category, status: "OPEN" },
      }),
      prisma.quote.count({
        where: { supplierId },
      }),
      prisma.rfq.count({
        where: {
          status: "IN_ESCROW",
          quotes: { some: { supplierId, status: "ACCEPTED" } },
        },
      }),
      prisma.quote.count({
        where: { supplierId },
      }),
      prisma.quote.count({
        where: { supplierId, status: "ACCEPTED" },
      }),
      prisma.rfq.findMany({
        where: { category, status: { in: ["OPEN", "QUOTED"] } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { buyer: true },
      }),
    ]);

  const responseRate =
    totalQuotes === 0 ? 0 : Math.round((acceptedQuotes / totalQuotes) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            {newRfqs} new RFQ{newRfqs !== 1 ? "s" : ""} match your category
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Respond quickly to improve your response rate
          </p>
        </div>
        <Link href="/dashboard/supplier/rfqs">
          <Button>View new RFQs</Button>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">New RFQs</p>
          <p className="text-2xl font-semibold mt-1">{newRfqs}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Quotes sent</p>
          <p className="text-2xl font-semibold mt-1">{quotesSent}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">To fulfill</p>
          <p className="text-2xl font-semibold mt-1">{toFulfill}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Acceptance rate</p>
          <p className="text-2xl font-semibold mt-1">{responseRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">Incoming RFQs</h2>
        <Link href="/dashboard/supplier/rfqs" className="text-xs text-gray-500 hover:text-gray-900">
          View all →
        </Link>
      </div>

      {incomingRfqs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">
            No open RFQs matching your category right now.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {incomingRfqs.map((rfq, i) => (
            <Link
              key={rfq.id}
              href={`/dashboard/supplier/rfqs/${rfq.id}`}
              className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 ${
                i !== incomingRfqs.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span>{rfq.product}</span>
              <span className="text-gray-500">
                {rfq.buyer.businessName || rfq.buyer.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  rfq.status === "OPEN"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {rfq.status === "OPEN" ? "New" : rfq.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;