"use server";

import prisma from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { ablyServer } from "@/app/lib/ably-server";

export async function sendMessage(rfqId: string, supplierId: string, content: string) {
  const session = await getServerSession();
  if (!session) return { error: "Not authenticated" };

  const rfq = await prisma.rfq.findUnique({ where: { id: rfqId } });
  if (!rfq) return { error: "RFQ not found" };

  const isBuyer = rfq.buyerId === session.user.id;
  const isSupplier = supplierId === session.user.id;
  if (!isBuyer && !isSupplier) return { error: "Not authorized" };

  const message = await prisma.message.create({
    data: { content, rfqId, supplierId, senderId: session.user.id },
  });

  await prisma.rfq.updateMany({
    where: { id: rfqId, status: { in: ["OPEN", "QUOTED"] } },
    data: { status: "NEGOTIATING" },
  });


// Broadcast the new message to the buyer and supplier
// connected to this negotiation thread
  const channel = ablyServer.channels.get(`thread:${rfqId}:${supplierId}`);
  await channel.publish("new-message", message);

  return { success: true, message: JSON.parse(JSON.stringify(message)) };
}