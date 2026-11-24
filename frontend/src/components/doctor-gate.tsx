
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DoctorHeader } from "@/components/doctor-header";

export function DoctorGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/doctor/login";
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoginPage) return;

    const controller = new AbortController();

    async function verifySession() {
      setChecking(true);
      setAuthorized(false);

      try {
        const response = await fetch(
          "/clinic-api/auth/session",
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        if (response.status === 401 || response.status === 403) {
          router.replace("/doctor/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to verify doctor session.");
        }

        setAuthorized(true);
      } catch {
        if (!controller.signal.aborted) {
          router.replace("/doctor/login");
        }
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }

    void verifySession();

    return () => controller.abort();
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking || !authorized) {
    return (
      <div
        role="status"
        className="flex min-h-[75vh] items-center justify-center bg-[#f7f9ff] text-slate-600"
      >
        Checking doctor access...
      </div>
    );
  }

  return (
    <>
      <DoctorHeader />
      {children}
    </>
  );
}
