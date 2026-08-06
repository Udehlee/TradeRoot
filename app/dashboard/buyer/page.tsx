import { getServerSession } from "@/app/lib/get-session";
import  prisma  from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreateRfqModal from "./create-rfq-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Dashboard | TradeRoot",
};

const BuyerDashboard = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const buyerId = session.user.id;

  const [openRfqs, newQuotes, inEscrow, completed, recentQuotes] =
    await Promise.all([
      prisma.rfq.count({
        where: { buyerId, status: { in: ["OPEN", "QUOTED", "NEGOTIATING"] } },
      }),
      prisma.quote.count({
        where: { rfq: { buyerId }, status: "PENDING" },
      }),
      prisma.rfq.count({
        where: { buyerId, status: "IN_ESCROW" },
      }),
      prisma.rfq.count({
        where: { buyerId, status: "COMPLETED" },
      }),
      prisma.quote.findMany({
        where: { rfq: { buyerId } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { rfq: true, supplier: true },
      }),
    ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            Welcome back, {session.user.firstname}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your sourcing
          </p>
        </div>
        <CreateRfqModal />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Open RFQs</p>
          <p className="text-2xl font-semibold mt-1">{openRfqs}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">New quotes</p>
          <p className="text-2xl font-semibold mt-1">{newQuotes}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">In escrow</p>
          <p className="text-2xl font-semibold mt-1">{inEscrow}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold mt-1">{completed}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">Recent quotes received</h2>
        <Link href="/dashboard/buyer/rfqs" className="text-xs text-gray-500 hover:text-gray-900">
          View all RFQs →
        </Link>
      </div>

      {recentQuotes.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">No quotes yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {recentQuotes.map((quote, i) => (
            <Link
              key={quote.id}
              href={`/dashboard/buyer/rfqs/${quote.rfqId}`}
              className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 ${
                i !== recentQuotes.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span>{quote.rfq.product}</span>
              <span className="text-gray-500">
                {quote.supplier.businessName || quote.supplier.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  quote.status === "PENDING"
                    ? "bg-yellow-50 text-yellow-700"
                    : quote.status === "ACCEPTED"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {quote.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;