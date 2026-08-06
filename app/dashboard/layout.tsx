import DashboardNav from "@/components/Nav";
import { getDashboardNav } from "../lib/dashboard-nav";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, navLinks } = await getDashboardNav();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav navLinks={navLinks} user={user} />
      <main className="container mx-auto max-w-7xl px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;