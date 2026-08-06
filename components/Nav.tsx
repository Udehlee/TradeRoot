import Link from "next/link";
import ProfileDropDown from "./profile-dropdown";

interface NavLink {
  href: string;
  label: string;
}

interface DashboardNavProps {
  navLinks: NavLink[];
  user: {
    firstname: string;
    lastname: string;
    role: string;
  };
}

const Nav = ({ navLinks, user }: DashboardNavProps) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-8 flex items-center justify-between h-20">

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <span className="text-gray-900 font-semibold text-lg">TradeRoot</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ProfileDropDown user={user} />

      </div>
    </header>
  );
};

export default Nav;