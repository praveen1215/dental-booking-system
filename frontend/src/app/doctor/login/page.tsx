
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import { Button } from "@heroui/react";

export default function DoctorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/clinic-api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            result.error ??
            "Invalid email or password."
        );
      }

      // The backend returns this token after login.
      // The logout endpoint requires it.
      if (typeof result.csrfToken === "string") {
        sessionStorage.setItem(
          "doctorCsrfToken",
          result.csrfToken
        );
      }

      router.replace("/doctor/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-[#f7f9ff] px-5 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-xl lg:grid-cols-2">

        {/* Left information panel */}
        <div className="hidden flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-500 p-12 text-white lg:flex">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <ShieldCheck size={34} />
          </div>

          <h1 className="mt-9 text-4xl font-extrabold leading-tight">
            DentalCare
            <span className="mt-2 block">
              Doctor Portal
            </span>
          </h1>

          <p className="mt-6 leading-8 text-blue-100">
            Manage patient appointments and clinic
            scheduling securely from your dashboard.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm font-semibold">
              Authorized Doctor Access
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              This portal is available only to the
              clinic's registered doctor.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="p-7 sm:p-12">
          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <LockKeyhole size={27} />
            </div>

            <h2 className="text-3xl font-extrabold text-[#15224D]">
              Doctor Login
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Enter your registered credentials to access
              your clinic dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="doctor-email"
                className="text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative mt-2">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="doctor-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="doctor@example.com"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="doctor-password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="doctor-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isDisabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </Button>

            <p className="text-center text-xs leading-6 text-slate-500">
              Doctor accounts are created by the clinic
              administrator. Public registration is disabled.
            </p>
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
                <ArrowLeft size={17} />
                Back to Home
            </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
