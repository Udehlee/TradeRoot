import { redirect } from "next/navigation";
import { getServerSession } from "@/app/lib/get-session";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role === "BUYER") {
    redirect("/dashboard/buyer");
  }

  if (session.user.role === "SUPPLIER") {
    redirect("/dashboard/supplier");
  }

  redirect("/signin");
}