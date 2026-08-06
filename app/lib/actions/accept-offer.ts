"use server";

import prisma from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { ablyServer } from "@/app/lib/ably-server";
import { revalidatePath } from "next/cache";

export async function acceptOffer(
  rfqId: string,
  supplierId: string,
  price: number,
  deliveryDays: number
) {
  const session = await getServerSession();
  if (!session) return { error: "Not authenticated" };

  const rfq = await prisma.rfq.findUnique({ where: { id: rfqId } });
  if (!rfq || rfq.buyerId !== session.user.id) {
    return { error: "Not authorized" };
  }

  const quote = await prisma.quote.findFirst({
    where: { rfqId, supplierId },
  });
  if (!quote) return { error: "No quote found for this supplier" };

  await prisma.$transaction([
    prisma.quote.update({
      where: { id: quote.id },
      data: { price, deliveryDays, status: "ACCEPTED" },
    }),
    prisma.quote.updateMany({
      where: { rfqId, NOT: { id: quote.id } },
      data: { status: "REJECTED" },
    }),
    prisma.rfq.update({
      where: { id: rfqId },
      data: { status: "AWARDED" },
    }),
  ]);

  const systemMessage = await prisma.message.create({
    data: {
      rfqId,
      supplierId,
      senderId: session.user.id,
      content: "Terms accepted — RFQ awarded to this supplier.",
    },
  });

  const channel = ablyServer.channels.get(`thread:${rfqId}:${supplierId}`);
  await channel.publish("new-message", JSON.parse(JSON.stringify(systemMessage)));
  await channel.publish("negotiation-ended", {});

  revalidatePath(`/dashboard/buyer/rfqs/${rfqId}`);
  revalidatePath(`/dashboard/messages/${rfqId}/${supplierId}`);

  return { success: true };
}