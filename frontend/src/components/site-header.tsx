
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, Smile } from "lucide-react";
import { Button } from "@heroui/react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Dental Care & Tips", href: "/dental-care" },
  { label: "Services", href: "/#services" },
  { label: "Appointment", href: "/book" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    function updateActiveSection() {
      const services = document.getElementById("services");

      if (!services) {
        setActiveSection("home");
        return;
      }

      const rect = services.getBoundingClientRect();

      // Highlight Services once its section reaches
      // the upper part of the screen.
      if (rect.top <= 180 && rect.bottom > 180) {
        setActiveSection("services");
      } else {
        setActiveSection("home");
      }
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/" && activeSection === "home";
    }

    if (href === "/#services") {
      return pathname === "/" && activeSection === "services";
    }

    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Smile size={24} />
          </span>

          <span className="text-xl font-bold tracking-tight text-[#15224D]">
            Dental<span className="text-blue-600">Care</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Book Appointment Button */}
        <div className="hidden lg:block">
          <Button
            variant="primary"
            className="rounded-full bg-blue-600 px-6 text-white"
            onPress={() => router.push("/book")}
          >
            Book Appointment
            <ArrowRight size={17} />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <details className="relative lg:hidden">
          <summary
            aria-label="Open navigation menu"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-blue-100 text-[#15224D] [&::-webkit-details-marker]:hidden"
          >
            <Menu size={22} />
          </summary>

          <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-blue-100 bg-white p-3 shadow-xl">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-50 ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Button
              variant="primary"
              className="mt-3 w-full rounded-xl bg-blue-600 text-white"
              onPress={() => router.push("/book")}
            >
              Book Appointment
              <ArrowRight size={16} />
            </Button>
          </div>
        </details>
      </nav>
    </header>
  );
}
