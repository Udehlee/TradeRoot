"use server";

import  prisma  from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { revalidatePath } from "next/cache";

export async function awardQuote(rfqId: string, quoteId: string) {
  const session = await getServerSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  // Confirm this RFQ actually belongs to the logged-in buyer
  const rfq = await prisma.rfq.findUnique({ where: { id: rfqId } });

  if (!rfq || rfq.buyerId !== session.user.id) {
    return { error: "Not authorized to award this RFQ" };
  }

  try {
    await prisma.$transaction([
      prisma.quote.update({
        where: { id: quoteId },
        data: { status: "ACCEPTED" },
      }),
      prisma.quote.updateMany({
        where: { rfqId, NOT: { id: quoteId } },
        data: { status: "REJECTED" },
      }),
      prisma.rfq.update({
        where: { id: rfqId },
        data: { status: "AWARDED" },
      }),
    ]);

    revalidatePath(`/dashboard/buyer/rfqs/${rfqId}`);
    return { success: true };
  } catch (err) {
    return { error: "Failed to award quote" };
  }
}