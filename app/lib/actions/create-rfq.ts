"use server";

import  prisma  from "@/app/lib/prisma";
import { getServerSession } from "@/app/lib/get-session";
import { revalidatePath } from "next/cache";

export async function createRfq(formData: {
  product: string;
  quantity: number;
  unit: string;
  category: string;
  notes?: string;
}) {
  const session = await getServerSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  try {
     // Create a new RFQ (Request for Quotation)
    // An rfq is a request from a buyer asking suppliers
    // to submit quotations for a product 
    await prisma.rfq.create({
      data: {
        product: formData.product,
        quantity: formData.quantity,
        unit: formData.unit,
        category: formData.category,
        notes: formData.notes,
        buyerId: session.user.id,
      },
    });

    revalidatePath("/dashboard/buyer");
    return { success: true };
  } catch (error) {
    return { error: "{Failed to create RFQ" };
  }
}