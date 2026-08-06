import { getServerSession } from "@/app/lib/get-session";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getThreadData } from "@/app/lib/get-thread-data";
import MessageThread from "@/components/message-thread";
import { Badge } from "@/components/ui/badge";

const statusBadge = (status: string | undefined) => {
  if (status === "ACCEPTED") {
    return (
      <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-50">
        Accepted
      </Badge>
    );
  }
  if (status === "REJECTED" || status === "WITHDRAWN") {
    return (
      <Badge variant="secondary" className="bg-red-50 text-red-500 hover:bg-red-50">
        Closed
      </Badge>
    );
  }
  return null;
};

const MessagesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ rfqId?: string; supplierId?: string }>;
}) => {
  const { rfqId, supplierId } = await searchParams;
  const session = await getServerSession();
  if (!session) redirect("/signin");

  const isSupplier = session.user.role === "SUPPLIER";

  const messages = await prisma.message.findMany({
    where: isSupplier
      ? { supplierId: session.user.id }
      : { rfq: { buyerId: session.user.id } },
    orderBy: { createdAt: "desc" },
    include: { rfq: { include: { buyer: true } }, supplier: true },
  });

  const threadsMap = new Map<string, (typeof messages)[number]>();
  for (const msg of messages) {
    const key = `${msg.rfqId}:${msg.supplierId}`;
    if (!threadsMap.has(key)) threadsMap.set(key, msg);
  }
  const threads = Array.from(threadsMap.values());

  const quotes = await prisma.quote.findMany({
    where: {
      OR: threads.map((t) => ({ rfqId: t.rfqId, supplierId: t.supplierId })),
    },
    select: { rfqId: true, supplierId: true, status: true },
  });

  const quoteStatusMap = new Map<string, string>();
  for (const q of quotes) {
    quoteStatusMap.set(`${q.rfqId}:${q.supplierId}`, q.status);
  }

  const selected =
    rfqId && supplierId ? await getThreadData(rfqId, supplierId) : null;

  return (
    <div className="flex border border-gray-100 rounded-lg overflow-hidden bg-white h-[600px]">
      <div className="w-72 border-r border-gray-100 overflow-y-auto flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium">Messages</p>
        </div>

        {threads.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8 px-4">
            No conversations yet
          </p>
        ) : (
          threads.map((t) => {
            const otherPartyName = isSupplier
              ? t.rfq.buyer.businessName || t.rfq.buyer.name
              : t.supplier.businessName || t.supplier.name;
            const isActive = t.rfqId === rfqId && t.supplierId === supplierId;
            const quoteStatus = quoteStatusMap.get(`${t.rfqId}:${t.supplierId}`);

            return (
              <Link
                key={`${t.rfqId}:${t.supplierId}`}
                href={`/dashboard/messages?rfqId=${t.rfqId}&supplierId=${t.supplierId}`}
                className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                  isActive ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{otherPartyName}</p>
                  {statusBadge(quoteStatus)}
                </div>
                <p className="text-xs text-gray-500 truncate">{t.rfq.product}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{t.content}</p>
              </Link>
            );
          })
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selected ? (
          <div className="flex-1">
            <MessageThread
              key={`${rfqId}-${supplierId}`}
              rfqId={rfqId!}
              supplierId={supplierId!}
              currentUserId={selected.session.user.id}
              initialMessages={selected.messages}
              initialEnded={selected.initialEnded}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;