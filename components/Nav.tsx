"use client";
import Link from "next/link";
import { useState } from "react";
import { FiChevronDown} from "react-icons/fi";

const categories = [
  {
    label: "All Categories",
    href: "/categories",
    hasDropdown: true,
    subcategories: [
      {
        group: "Raw Materials",
        href: "/categories/raw-materials",
        items: [
          { label: "Minerals & Metals", href: "/categories/raw-materials/minerals" },
          { label: "Timber & Wood", href: "/categories/raw-materials/timber" },
          { label: "Chemicals", href: "/categories/raw-materials/chemicals" },
        ],
      },
      {
        group: "Industrial Supplies",
        href: "/categories/industrial",
        items: [
          { label: "Machinery & Equipment", href: "/categories/industrial/machinery" },
          { label: "Tools & Hardware", href: "/categories/industrial/tools" },
          { label: "Packaging Materials", href: "/categories/industrial/packaging" },
        ],
      },
      {
        group: "Food & Beverage",
        href: "/categories/food",
        items: [
          { label: "Processed Foods", href: "/categories/food/processed" },
          { label: "Beverages", href: "/categories/food/beverages" },
          { label: "Frozen & Perishables", href: "/categories/food/frozen" },
        ],
      },
      {
        group: "Textiles & Fabrics",
        href: "/categories/textiles",
        items: [
          { label: "Finished Textiles", href: "/categories/textiles/finished" },
          { label: "Garments & Apparel", href: "/categories/textiles/garments" },
          { label: "Leather & Synthetics", href: "/categories/textiles/leather" },
        ],
      },
      {
        group: "Construction",
        href: "/categories/construction",
        items: [
          { label: "Cement & Concrete", href: "/categories/construction/cement" },
          { label: "Roofing Materials", href: "/categories/construction/roofing" },
          { label: "Electrical Fittings", href: "/categories/construction/electrical" },
        ],
      },
      {
        group: "Technology",
        href: "/categories/technology",
        items: [
          { label: "Industrial Electronics", href: "/categories/technology/industrial" },
          { label: "Telecoms Equipment", href: "/categories/technology/telecoms" },
          { label: "Solar & Energy", href: "/categories/technology/solar" },
        ],
      },
    ],
  },
  { label: "Raw Materials", href: "/categories/raw-materials" },
  { label: "Industrial", href: "/categories/industrial" },
  { label: "Food & Beverage", href: "/categories/food" },
  { label: "Textiles", href: "/categories/textiles" },
  { label: "Construction", href: "/categories/construction" },
  { label: "Technology", href: "/categories/technology" },
  { label: "Healthcare", href: "/categories/healthcare" },
];

const Nav = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">

          {/* Categories */}
          <ul className="flex items-center">
            {categories.map((cat) => (
              <li
                key={cat.label}
                className="relative"
                onMouseEnter={() => {
                  setActiveCategory(cat.label);
                  if (cat.hasDropdown) setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  setActiveCategory("");
                  setDropdownOpen(false);
                }}
              >
                <Link
                  href={cat.href}
                  className={`flex items-center gap-1 px-3 py-3.5 text-sm transition-colors whitespace-nowrap
                    ${cat.label === "All Categories"
                      ? "font-medium text-gray-900 border-r border-gray-200 pr-4 mr-1"
                      : "text-gray-600 hover:text-gray-900"
                    }
                    ${activeCategory === cat.label ? "text-gray-900" : ""}
                  `}
                >
                  {cat.label}
                  {cat.hasDropdown && (
                    <FiChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                {/* Mega dropdown */}
                {cat.hasDropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 z-50 w-[680px] bg-white border border-gray-200 rounded-b-xl shadow-lg p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {cat.subcategories?.map((group) => (
                        <div key={group.group}>
                          <Link
                            href={group.href}
                            className="block text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3 hover:text-gray-600 transition-colors"
                          >
                            {group.group}
                          </Link>
                          <ul className="space-y-2">
                            {group.items.map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors block"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Footer of dropdown */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Browse all categories
                      </span>
                      <Link
                        href="/categories"
                        className="text-xs font-medium text-gray-900 hover:underline"
                      >
                        View all →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right nav extras */}
          <div className="flex items-center gap-5">
            <Link
              href="/deals"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors whitespace-nowrap"
            >
             
            </Link>

            <Link
              href="/live"
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-500 transition-colors whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              TradeRoot Live
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Nav;