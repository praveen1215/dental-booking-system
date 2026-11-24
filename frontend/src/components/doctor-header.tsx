
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  CalendarOff,
  LogOut,
  Menu,
  Stethoscope,
} from "lucide-react";

const links = [
  {
    label: "Appointments",
    href: "/doctor/dashboard",
    icon: CalendarDays,
  },
  {
    label: "Manage Services",
    href: "/doctor/services",
    icon: ClipboardList,
  },
  {
    label: "Working Hours",
    href: "/doctor/availability",
    icon: Clock3,
  },
  {
    label: "Unavailable Dates",
    href: "/doctor/unavailability",
    icon: CalendarOff,
  },
];

export function DoctorHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  if (pathname === "/doctor/login") {
    return null;
  }

  async function logout() {
    setError("");

    const csrfToken =
      sessionStorage.getItem("doctorCsrfToken");

    if (!csrfToken) {
      setError("Logout token unavailable. Please refresh your session.");
      return;
    }

    setLoggingOut(true);

    try {
      const response = await fetch("/clinic-api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed (${response.status}).`);
      }

      sessionStorage.removeItem("doctorCsrfToken");
      router.replace("/doctor/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log out."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/doctor/dashboard"
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Stethoscope size={23} />
          </span>

          <span>
            <span className="block text-xl font-bold text-[#15224D]">
              Dental<span className="text-blue-600">Care</span>
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Doctor Portal
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors ${
                  active
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut size={17} />
            {loggingOut ? "Logging Out..." : "Logout"}
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle doctor navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-11 items-center justify-center rounded-xl border border-blue-100 text-[#15224D] lg:hidden"
        >
          <Menu size={22} />
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-blue-100 bg-white px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <item.icon size={19} />
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => void logout()}
              disabled={loggingOut}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="bg-red-50 px-5 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}
    </header>
  );
}
