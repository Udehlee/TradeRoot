import { redirect } from "next/navigation";
import { getServerSession } from "./get-session";

const navLinksByRole: Record<string, { href: string; label: string }[]> = {
  BUYER: [
    { href: "/dashboard/buyer", label: "Dashboard" },
    { href: "/dashboard/buyer/rfqs", label: "My RFQs" },
    { href: "/dashboard/buyer/orders", label: "Orders" },
    { href: "/dashboard/messages", label: "Messages" },
  ],
  SUPPLIER: [
    { href: "/dashboard/supplier", label: "Dashboard" },
    { href: "/dashboard/supplier/rfqs", label: "Incoming RFQs" },
    { href: "/dashboard/supplier/quotes", label: "My quotes" },
    { href: "/dashboard/supplier/orders", label: "Orders" },
    { href: "/dashboard/messages", label: "Messages" },
  ],
};

export const getDashboardNav = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const user = session.user;
  const role = user.role;
  const navLinks = navLinksByRole[role] ?? navLinksByRole.BUYER;

  return { user, navLinks };
};