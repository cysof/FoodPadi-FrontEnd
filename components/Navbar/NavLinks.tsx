"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "About", href: "/about" },
];

const NavLinks = ({
  scrolled = false,
  onClose,
}: {
  scrolled?: boolean;
  onClose?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            onClick={onClose}
            className={`flex items-center font-inter text-sm font-medium transition-all duration-200 px-3 py-2.5 rounded-lg md:px-0 md:py-0 md:rounded-none md:pb-0.5 md:border-b-2 ${
              pathname === link.href
                ? "bg-green-50 text-primary md:bg-transparent md:border-primary"
                : "text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-transparent md:hover:text-primary md:hover:border-primary"
            } ${
              scrolled
                ? ""
                : "md:text-white/85 md:hover:text-white md:border-transparent md:hover:border-yellow-400"
            } ${
              pathname === link.href && !scrolled
                ? "md:text-white md:border-yellow-400"
                : ""
            }`}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;