// components/Navbar/NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "About", href: "/about" },
];

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className={`flex flex-col md:flex-row items-start md:items-center gap-6`}>
      {links.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className={`font-inter text-sm font-medium transition-colors duration-200 ${
              pathname === link.href
                ? `text-primary border-b-2 border-primary pb-0.5`
                : `text-black hover:text-primary`
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