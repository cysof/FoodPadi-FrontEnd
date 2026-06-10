"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
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

  if (isAuthenticated) {
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">

        {/* Auth Links — Dashboard, Contact */}
        {authLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className={`flex items-center font-inter text-sm font-medium transition-all duration-200
              px-3 py-2.5 rounded-lg
              md:px-0 md:py-0 md:rounded-none md:pb-0.5 md:border-b-2
              ${
                pathname === link.href ||
                (link.href === "/dashboard" &&
                  pathname.startsWith("/dashboard"))
                  ? "bg-green-50 text-primary md:bg-transparent md:border-primary"
                  : "text-gray-700 hover:bg-gray-50 md:hover:bg-transparent md:border-transparent md:hover:text-primary md:hover:border-primary"
              }
              ${
                !scrolled
                  ? "md:text-white/85 md:hover:text-white md:border-transparent md:hover:border-yellow-400"
                  : ""
              }
              ${
                (pathname === link.href ||
                  (link.href === "/dashboard" &&
                    pathname.startsWith("/dashboard"))) &&
                !scrolled
                  ? "md:text-white md:border-yellow-400"
                  : ""
              }
            `}
          >
            {link.name}
          </Link>
        ))}

        {/* Bell + Username */}
        <div className="flex items-center gap-3 px-3 py-2 md:px-0 md:py-0">
          <div className={`transition-colors duration-300 ${
            scrolled ? "text-gray-700" : "md:text-white text-gray-700"
          }`}>
            <NotificationBell />
          </div>
          <span className={`font-inter text-sm font-medium ${
            scrolled ? "text-primary" : "md:text-white text-primary"
          }`}>
            {user?.username}
          </span>
        </div>

        {/* Logout */}
        <div className="px-3 md:px-0">
          <button
            onClick={confirmLogout}
            className="w-full md:w-auto font-inter text-sm font-semibold bg-yellow-400 text-green-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Logout
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 px-3 md:px-0">
      <Link href="/auth/login" onClick={onClose}>
        <button className={`w-full md:w-auto font-inter text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
          scrolled
            ? "border-primary text-primary hover:bg-green-50"
            : "border-white/50 text-white hover:bg-white/10 md:text-white text-gray-700 md:border-white/50 border-gray-300"
        }`}>
          Login
        </button>
      </Link>
      <Link href="/auth/register" onClick={onClose}>
        <button className="w-full md:w-auto font-inter text-sm font-semibold bg-yellow-400 text-green-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors">
          Register
        </button>
      </Link>
    </div>
  );
};

export default NavActions;