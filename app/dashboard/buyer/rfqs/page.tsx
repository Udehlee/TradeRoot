import { getServerSession } from "@/app/lib/get-session";
import  prisma  from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My RFQs | TradeRoot",
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  OPEN: "bg-blue-50 text-blue-600",
  QUOTED: "bg-green-50 text-green-700",
  NEGOTIATING: "bg-yellow-50 text-yellow-700",
  AWARDED: "bg-purple-50 text-purple-700",
  IN_ESCROW: "bg-indigo-50 text-indigo-700",
  FULFILLED: "bg-teal-50 text-teal-700",
  COMPLETED: "bg-green-100 text-green-800",
  CLOSED: "bg-red-50 text-red-600",
};

const MyRfqsPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const rfqs = await prisma.rfq.findMany({
    where: { buyerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { quotes: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">My RFQs</h1>
      <p className="text-sm text-gray-500 mb-6">
        {rfqs.length} request{rfqs.length !== 1 ? "s" : ""} total
      </p>

      {rfqs.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">
            You havent created any RFQs yet.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          {rfqs.map((rfq, i) => (
            <Link
              key={rfq.id}
              href={`/dashboard/buyer/rfqs/${rfq.id}`}
              className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 ${
                i !== rfqs.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div>
                <p className="font-medium">{rfq.product}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {rfq.quantity} {rfq.unit} · {rfq.category}
                </p>
              </div>

              <span className="text-gray-500">
                {rfq._count.quotes} quote{rfq._count.quotes !== 1 ? "s" : ""}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  statusStyles[rfq.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {rfq.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRfqsPage;