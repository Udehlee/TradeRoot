"use server";

import prisma from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { ablyServer } from "@/app/lib/ably-server";

export async function proposeTerms(
  rfqId: string,
  supplierId: string,
  price: number,
  deliveryDays: number
) {
  const session = await getServerSession();
  if (!session) return { error: "Not authenticated" };

  const message = await prisma.message.create({
    data: {
      rfqId,
      supplierId,
      senderId: session.user.id,
      content: `Proposed: ₦${price.toLocaleString()} · ${deliveryDays}-day delivery`,
      isOffer: true,
      proposedPrice: price,
      proposedDeliveryDays: deliveryDays,
    },
  });

  const channel = ablyServer.channels.get(`thread:${rfqId}:${supplierId}`);
  await channel.publish("new-message", message);

  return { success: true, message: JSON.parse(JSON.stringify(message)) };
}