// components/Navbar/NavActions.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useLogoutMutation } from "@/features/crops/data/CropApi";
import { usePathname } from "next/navigation";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const authLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Contact", href: "/contact" },
];

const NavActions = ({
  scrolled = false,
  onClose,
}: {
  scrolled?: boolean;
  onClose?: () => void;
}) => {
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



// Inside the authenticated return, add NotificationBell before username:

if (isAuthenticated) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
      {authLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`font-inter text-sm font-medium transition-all duration-200 pb-0.5 border-b-2 ${
            pathname === link.href ||
            (link.href === "/dashboard" && pathname.startsWith("/dashboard"))
              ? scrolled
                ? "text-primary border-primary"
                : "text-white border-yellow-400"
              : scrolled
              ? "text-gray-700 border-transparent hover:text-primary hover:border-primary"
              : "text-white/85 border-transparent hover:text-white hover:border-yellow-400"
          }`}
        >
          {link.name}
        </Link>
      ))}

      {/* Bell + username */}
      <div className={`flex items-center gap-3 transition-colors duration-300 ${
        scrolled ? "text-gray-700" : "text-white"
      }`}>
        <NotificationBell />
        <span className={`font-inter text-sm font-medium ${
          scrolled ? "text-primary" : "text-white"
        }`}>
          {user?.username}
        </span>
      </div>

      {/* Logout */}
      <button
        onClick={confirmLogout}
        className="font-inter text-sm font-semibold bg-yellow-400 text-green-900 px-4 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors"
      >
        Logout
      </button>
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