
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";
import { Button } from "@heroui/react";

type Appointment = {
  appointmentId: string;
  bookingReference: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceName: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
};

type AppointmentResponse = {
  data: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const PAGE_SIZE = 10;

function formatAppointmentDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatAppointmentTime(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString));
}

export default function DoctorDashboardPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const loadAppointments = useCallback(
    async (currentPage: number, signal?: AbortSignal) => {
      const response = await fetch(
        `/clinic-api/doctor/appointments?page=${currentPage}&limit=${PAGE_SIZE}`,
        {
          credentials: "include",
          cache: "no-store",
          signal,
        }
      );

      if (response.status === 401) {
        router.replace("/doctor/login");
        throw new Error("Doctor session expired. Please log in.");
      }

      if (!response.ok) {
        throw new Error("Unable to load appointments.");
      }

      const result: AppointmentResponse = await response.json();

      if (!Array.isArray(result.data)) {
        throw new Error("Unexpected appointment response.");
      }

      if (signal?.aborted) return;

      setAppointments(result.data);
      setTotal(result.pagination.total);
      setTotalPages(Math.max(1, result.pagination.totalPages));
    },
    [router]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function initialize() {
      setLoading(true);

      try {
        // Check the authenticated doctor session.
        const session = await fetch("/clinic-api/auth/session", {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (session.status === 401 || session.status === 403) {
          router.replace("/doctor/login");
          return;
        }

        if (!session.ok) {
          throw new Error("Unable to verify doctor session.");
        }

        // Appointment list is independently protected by
        // requireDoctor in the Express backend.
        await loadAppointments(page, controller.signal);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void initialize();
    return () => controller.abort();
  }, [page, loadAppointments, router]);

  async function refresh() {
    setRefreshing(true);
    setError("");

    try {
      await loadAppointments(page);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh appointments."
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function logout() {
    setError("");

    const csrfToken =
      sessionStorage.getItem("doctorCsrfToken");

    if (!csrfToken) {
      setError(
        "A logout security token is unavailable. Please log in again to obtain a new token."
      );
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
        throw new Error(
          `Logout failed (${response.status}).`
        );
      }

      sessionStorage.removeItem("doctorCsrfToken");
      router.replace("/doctor/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log out."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const confirmedOnPage = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const cancelledOnPage = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f9ff]">
        <p role="status" className="text-slate-600">
          Loading doctor dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] px-5 py-12 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard title */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Doctor Portal
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
              Appointment Dashboard
            </h1>

            <p className="mt-3 text-slate-500">
              View and manage patient appointment information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onPress={() => void refresh()}
              isDisabled={refreshing}
              className="rounded-xl"
            >
              <RefreshCw size={17} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="outline"
              onPress={() => void logout()}
              isDisabled={loggingOut}
              className="rounded-xl border-red-200 text-red-600"
            >
              <LogOut size={17} />
              {loggingOut ? "Logging Out..." : "Logout"}
            </Button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Overview cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
            <CalendarDays className="text-blue-600" size={28} />
            <p className="mt-5 text-sm text-slate-500">
              Total Appointments
            </p>
            <p className="mt-2 text-3xl font-bold text-[#15224D]">
              {total}
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
            <CheckCircle2 className="text-green-600" size={28} />
            <p className="mt-5 text-sm text-slate-500">
              Confirmed on This Page
            </p>
            <p className="mt-2 text-3xl font-bold text-[#15224D]">
              {confirmedOnPage}
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
            <Clock3 className="text-amber-600" size={28} />
            <p className="mt-5 text-sm text-slate-500">
              Cancelled on This Page
            </p>
            <p className="mt-2 text-3xl font-bold text-[#15224D]">
              {cancelledOnPage}
            </p>
          </div>
        </div>

        {/* Appointments table */}
        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 p-6">
            <Users size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-[#15224D]">
                Patient Appointments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All bookings associated with your doctor account.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-blue-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Reference
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Patient
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Service
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Time
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.appointmentId}
                    className="hover:bg-blue-50/40"
                  >
                    <td className="px-6 py-5 font-semibold text-blue-700">
                      {appointment.bookingReference}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold">
                        {appointment.patientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {appointment.patientEmail}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {appointment.patientPhone}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium">
                        {appointment.serviceName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {appointment.durationMinutes} min
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      {formatAppointmentDate(appointment.startTime)}
                    </td>

                    <td className="px-6 py-5">
                      {formatAppointmentTime(appointment.startTime)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          appointment.status === "confirmed"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appointments.length === 0 && !error && (
            <div className="p-12 text-center text-slate-500">
              No appointments found.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 p-6">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                isDisabled={page <= 1}
                onPress={() =>
                  setPage((current) => current - 1)
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                isDisabled={page >= totalPages}
                onPress={() =>
                  setPage((current) => current + 1)
                }
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
