"use server";

import prisma from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { ablyServer } from "@/app/lib/ably-server";
import { revalidatePath } from "next/cache";

export async function endNegotiation(rfqId: string, supplierId: string) {
  const session = await getServerSession();
  if (!session) return { error: "Not authenticated" };

  const rfq = await prisma.rfq.findUnique({ where: { id: rfqId } });
  if (!rfq) return { error: "RFQ not found" };

  const isBuyer = rfq.buyerId === session.user.id;
  const isSupplier = supplierId === session.user.id;
  if (!isBuyer && !isSupplier) return { error: "Not authorized" };

  const quote = await prisma.quote.findFirst({
    where: { rfqId, supplierId },
  });

  if (quote) {
    await prisma.quote.update({
      where: { id: quote.id },
      data: { status: isBuyer ? "REJECTED" : "WITHDRAWN" },
    });
  }

  const message = await prisma.message.create({
    data: {
      rfqId,
      supplierId,
      senderId: session.user.id,
      content: isBuyer
        ? "Buyer declined this negotiation."
        : "Supplier withdrew from this negotiation.",
    },
  });

  const channel = ablyServer.channels.get(`thread:${rfqId}:${supplierId}`);
  await channel.publish("new-message", JSON.parse(JSON.stringify(message)));
  await channel.publish("negotiation-ended", {});

  revalidatePath(`/dashboard/messages/${rfqId}/${supplierId}`);
  revalidatePath(`/dashboard/buyer/rfqs/${rfqId}`);

  return { success: true };
}