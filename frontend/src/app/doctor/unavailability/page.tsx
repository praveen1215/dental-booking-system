
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarOff,
  Plus,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import {
  DOCTOR_API,
  doctorRequest,
} from "@/lib/doctor-api";

type UnavailableDate = {
  id: string;
  date: string;
  reason: string;
};

function getToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")}`;
}


function displayDate(value: string): string {
  if (!value) {
    return "Date unavailable";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function parseUnavailableDates(
  result: unknown
): UnavailableDate[] {
  const wrapper =
    result && typeof result === "object"
      ? (result as {
          data?: unknown;
          unavailability?: unknown;
        })
      : null;

  const raw = Array.isArray(result)
    ? result
    : wrapper?.unavailability ?? wrapper?.data;

  if (!Array.isArray(raw)) {
    throw new Error("Unexpected unavailable dates response.");
  }

  return raw.map((item) => {
    const entry = item as Record<string, unknown>;

    return {
      id: String(
        entry.unavailabilityId ?? entry.id ?? ""
      ),
      date: String(
        entry.startTime ?? entry.date ?? ""
      ),
      reason:
        typeof entry.reason === "string"
          ? entry.reason
          : "",
    };
  });
}

function getNextDate(date: string): string {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

export default function DoctorUnavailabilityPage() {
  const [dates, setDates] = useState<UnavailableDate[]>([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await doctorRequest<unknown>(
        DOCTOR_API.weeklySchedule
      );

      setDates(parseUnavailableDates(result));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load unavailable dates."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDates();
  }, [loadDates]);

  async function addUnavailableDate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (date < getToday()) {
      setError("Please choose today or a future date.");
      return;
    }

    setSaving(true);

    try {
      // Verify this payload against your Express route.
    const startTime = `${date}T00:00:00+05:30`;
    const endTime = `${getNextDate(date)}T00:00:00+05:30`;

    await doctorRequest(DOCTOR_API.unavailability, {
      method: "POST",
      body: JSON.stringify({
        startTime,
        endTime,
        reason: reason.trim(),
      }),
    });

      setSuccess("Unavailable date saved successfully.");
      setDate("");
      setReason("");

      await loadDates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save unavailable date."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="mb-9">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
          Doctor Portal
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
          Unavailable Dates
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
          Mark dates when you are not accepting appointments,
          such as leave days or clinic closures.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
        <section className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarOff size={25} />
            </span>

            <h2 className="text-xl font-bold text-[#15224D]">
              Block a Date
            </h2>
          </div>

          <form
            onSubmit={(event) => void addUnavailableDate(event)}
            className="mt-8 space-y-6"
          >
            <div>
              <label
                htmlFor="unavailable-date"
                className="text-sm font-semibold text-slate-700"
              >
                Unavailable Date
              </label>

              <input
                id="unavailable-date"
                type="date"
                required
                min={getToday()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="unavailable-reason"
                className="text-sm font-semibold text-slate-700"
              >
                Reason (Optional)
              </label>

              <textarea
                id="unavailable-reason"
                rows={4}
                maxLength={250}
                placeholder="Example: Doctor on leave"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={18} />
              {saving ? "Saving..." : "Block Date"}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-blue-100 p-7">
            <div className="flex items-center gap-3">
              <CalendarDays size={25} className="text-blue-600" />

              <h2 className="text-xl font-bold text-[#15224D]">
                Blocked Dates
              </h2>
            </div>

            <button
              type="button"
              aria-label="Refresh blocked dates"
              onClick={() => void loadDates()}
              disabled={loading}
              className="rounded-xl border border-blue-100 p-2 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw size={19} />
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-slate-500">
              Loading unavailable dates...
            </p>
          ) : dates.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarOff
                size={40}
                className="mx-auto text-blue-300"
              />
              <h3 className="mt-5 font-bold text-[#15224D]">
                No Dates Blocked
              </h3>
              <p className="mt-3 text-sm text-slate-500">
                Unavailable dates will appear here after they
                are saved successfully.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dates.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-6"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <CalendarOff size={21} />
                  </span>

                  <div>
                    <h3 className="font-semibold text-[#15224D]">
                      {displayDate(item.date)}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.reason || "No reason provided"}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      Unavailable
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}
    </main>
  );
}
