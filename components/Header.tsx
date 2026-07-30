import Link from "next/link";
import Search from "./Search";
import Nav from "./Nav";
import { Button } from "@/components/ui/button";
import { SignupDropdown } from "@/components/signup-dropdown";

const Header = () => {
  return (
    <div className="headerWrapper sticky top-0 z-50 shadow-sm">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-8 flex items-center gap-8 h-20">

          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <span className="text-gray-900 font-semibold text-lg tracking-tight">
              TradeRoot
            </span>
          </Link>

          <div className="flex-1 max-w-2xl">
            <Search />
          </div>

         
          <div className="flex items-center gap-4 flex-shrink-0">

            <Link href="/signup/supplier" className="hidden lg:flex">
              <Button variant="ghost">
                Become a supplier
              </Button>
            </Link>

            <span className="w-px h-5 bg-gray-200 hidden lg:block" />

            <Link href="/signin">
              <Button variant="ghost">
                Log in
              </Button>
            </Link>

            <SignupDropdown />

          </div>
        </div>
      </header>

      <Nav />
    </div>
  );
};

export default Header;