// components/Navbar/NavActions.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useLogoutMutation } from "@/features/crops/data/CropApi";
import { usePathname } from "next/navigation";

const authLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Contact", href: "/contact" },
];

const NavActions = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.login.token);
  const user = useAppSelector((state) => state.login.user);

  const [LogoutMutation] = useLogoutMutation();

  const isAuthenticated = token.access && token.refresh;

  const confirmLogout = () => {
    confirmDialog({
      message: "Are you sure you want to log out?",
      header: "Logout Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () =>
        LogoutMutation()
          .unwrap()
          .then(() => dispatch({ type: "logout" }))
          .catch(() => dispatch({ type: "logout" })),
    });
  };

  if (isAuthenticated) {
    return (
      <div className={`flex flex-col md:flex-row items-start md:items-center gap-6`}>
        {authLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`font-inter text-sm font-medium transition-colors duration-200 ${
              pathname === link.href ||
              (link.href === "/dashboard" && pathname.startsWith("/dashboard"))
                ? `text-primary border-b-2 border-primary pb-0.5`
                : `text-black hover:text-primary`
            }`}
          >
            {link.name}
          </Link>
        ))}
        <span className={`font-inter text-sm font-medium text-primary`}>
          {user?.username}
        </span>
        <Button
          onClick={confirmLogout}
          outlined
          severity="danger"
          className={`py-1.5 px-4 text-sm font-inter font-medium`}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row items-center gap-3`}>
      <Link href={`/auth/login`}>
        <Button
          outlined
          className={`py-1.5 px-4 text-sm font-inter font-medium border-primary text-primary`}
        >
          Login
        </Button>
      </Link>
      <Link href={`/auth/register`}>
        <Button
          className={`py-1.5 px-4 text-sm font-inter font-medium primary`}
        >
          Register
        </Button>
      </Link>
    </div>
  );
};

export default NavActions;