"use server";

import  prisma  from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { revalidatePath } from "next/cache";

export async function createQuote(
  rfqId: string,
  data: { price: number; deliveryDays: number; message?: string }
) {
  const session = await getServerSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.quote.create({
      data: {
        price: data.price,
        deliveryDays: data.deliveryDays,
        message: data.message,
        rfqId,
        supplierId: session.user.id,
      },
    });

    // keep the RFQ into QUOTED status if it's still just OPEN
    await prisma.rfq.updateMany({
      where: { id: rfqId, status: "OPEN" },
      data: { status: "QUOTED" },
    });

    revalidatePath("/dashboard/supplier");
    revalidatePath(`/dashboard/buyer/rfqs/${rfqId}`);
    return { success: true };
  } catch (err) {
    return { error: "Failed to submit quote" };
  }
}