import prisma from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { redirect, notFound } from "next/navigation";

export async function getThreadData(rfqId: string, supplierId: string) {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  // Load the RFQ (Request for Quotation) together with its buyer
  // An RFQ represents a buyer's request for suppliers to submit quotations
  const rfq = await prisma.rfq.findUnique({
    where: { id: rfqId },
    include: { buyer: true },
  });

  if (!rfq) {
    notFound();
  }

  // Only the buyer who created the RFQ or the supplier
  // who submitted the quotation can access this negotiation
  const isBuyer = rfq.buyerId === session.user.id;
  const isSupplier = session.user.id === supplierId;

  if (!isBuyer && !isSupplier) {
    notFound();
  }

  // When the current user is the buyer, fetch the supplier once
  // so we can display the participant on the other side
  // of the conversation.
  const supplier = isBuyer
    ? await prisma.user.findUnique({
        where: { id: supplierId },
        select: {
          name: true,
          businessName: true,
        },
      })
    : null;


  const participantName = isBuyer
    ? supplier?.businessName ?? supplier?.name
    : rfq.buyer.businessName || rfq.buyer.name;

  // Retrieve the supplier's quotation for this RFQ
  const quote = await prisma.quote.findFirst({
    where: { rfqId, supplierId },
  });

  // A negotiation ends once the quotation has been accepted,
  // rejected or withdrawn
  const initialEnded =
    quote?.status === "ACCEPTED" ||
    quote?.status === "REJECTED" ||
    quote?.status === "WITHDRAWN";

  const messages = await prisma.message.findMany({
    where: { rfqId, supplierId },
    orderBy: { createdAt: "asc" },
  });

  return {
    session,
    rfq,
    participantName,
    messages: JSON.parse(JSON.stringify(messages)),
    initialEnded,
  };
}