
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DoctorHeader } from "@/components/doctor-header";

type AccessState = "checking" | "allowed" | "denied";

export function DoctorGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/doctor/login";

  const [access, setAccess] = useState<AccessState>("checking");
  const [verifiedPath, setVerifiedPath] = useState("");

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    const controller = new AbortController();

    async function checkDoctorAccess() {
      setAccess("checking");

      try {
        // Existing doctor-only API.
        // Express must enforce requireDoctor on this route.
        const response = await fetch(
          "/clinic-api/doctor/appointments?page=1&limit=1",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        if (response.status === 401 || response.status === 403) {
          setAccess("denied");
          router.replace("/doctor/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Unable to verify doctor access."
          );
        }

        setVerifiedPath(pathname);
        setAccess("allowed");
      } catch (err) {
        if (controller.signal.aborted) return;

        // Do not display protected content when
        // authentication cannot be verified.
        setAccess("denied");

        console.error("Doctor access check failed:", err);
      }
    }

    void checkDoctorAccess();

    return () => controller.abort();
  }, [pathname, isLoginPage, router]);

  // The login page is public.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Never render the dashboard until verification succeeds.
  if (
    access === "checking" ||
    (access === "allowed" && verifiedPath !== pathname)
  ) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f7f9ff]">
        <p role="status" className="text-sm text-slate-600">
          Verifying doctor access...
        </p>
      </main>
    );
  }

  if (access === "denied") {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center gap-4 bg-[#f7f9ff] px-5">
        <h1 className="text-xl font-bold text-[#15224D]">
          Doctor Access Unavailable
        </h1>

        <p className="text-center text-sm text-slate-600">
          Please sign in again if your session has expired,
          or check that the backend is running.
        </p>

        <button
          type="button"
          onClick={() => router.replace("/doctor/login")}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Go to Doctor Login
        </button>
      </main>
    );
  }

  return (
    <>
      <DoctorHeader />
      {children}
    </>
  );
}
