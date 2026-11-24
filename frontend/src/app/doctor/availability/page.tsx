
"use client";

import { useEffect, useState } from "react";
import { Clock3, Save, CalendarDays } from "lucide-react";
import {
  DOCTOR_API,
  doctorRequest,
} from "@/lib/doctor-api";

type WorkingDay = {
  dayOfWeek: number;
  dayName: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
};

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const defaultDays: WorkingDay[] = dayNames.map((dayName, dayOfWeek) => ({
  dayOfWeek,
  dayName,
  isAvailable: false,
  startTime: "09:00",
  endTime: "17:00",
}));

export default function DoctorAvailabilityPage() {
  const [days, setDays] = useState<WorkingDay[]>(defaultDays);
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
useEffect(() => {
  let cancelled = false;

  async function loadSchedule() {
    setLoading(true);
    setError("");

    try {
      const result = await doctorRequest<{
        weekly: {
          scheduleId: string;
          dayOfWeek: number;
          startTime: string;
          endTime: string;
          doctorId: string;
        }[];
        overrides: unknown[];
        unavailability: unknown[];
      }>(DOCTOR_API.weeklySchedule);

      if (!Array.isArray(result.weekly)) {
        throw new Error("Unexpected weekly schedule response.");
      }

      if (cancelled) return;

      setDays((previousDays) =>
        previousDays.map((day) => {
          const savedDay = result.weekly.find(
            (item) => item.dayOfWeek === day.dayOfWeek
          );

          if (!savedDay) {
            return {
              ...day,
              isAvailable: false,
            };
          }

          return {
            ...day,
            isAvailable: true,
            startTime: savedDay.startTime.slice(0, 5),
            endTime: savedDay.endTime.slice(0, 5),
          };
        })
      );
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load working hours."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void loadSchedule();

  return () => {
    cancelled = true;
  };
}, []);


  function updateDay(
    dayOfWeek: number,
    changes: Partial<WorkingDay>
  ) {
    setDays((previous) =>
      previous.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, ...changes }
          : day
      )
    );
    setSuccess("");
  }

  
async function saveDay(day: WorkingDay) {
  setError("");
  setSuccess("");

  if (day.isAvailable && day.startTime >= day.endTime) {
    setError(
      `${day.dayName}: ending time must be later than starting time.`
    );
    return;
  }

  setSavingDay(day.dayOfWeek);

  try {
    const endpoint =
      `${DOCTOR_API.weeklySchedule}/weekly/${day.dayOfWeek}`;

    if (day.isAvailable) {
      // Set working hours
      await doctorRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify({
          startTime: day.startTime,
          endTime: day.endTime,
        }),
      });
    } else {
      // Mark the day as closed
      await doctorRequest(endpoint, {
        method: "DELETE",
      });
    }

    setSuccess(
      day.isAvailable
        ? `${day.dayName} working hours saved successfully.`
        : `${day.dayName} marked as closed.`
    );
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to save working hours."
    );
  } finally {
    setSavingDay(null);
  }
}


  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="mb-9">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
          Doctor Portal
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#15224D] sm:text-4xl">
          Working Hours
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
          Set which days the clinic accepts appointments
          and the times you are available.
        </p>
      </div>

      <div className="mb-7 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <CalendarDays className="mt-1 shrink-0 text-blue-600" size={25} />

        <div>
          <h2 className="font-bold text-[#15224D]">
            Weekly Availability
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            These hours form your regular schedule. The
            appointment system uses your backend's scheduling
            rules to generate available patient slots.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-slate-500">
          Loading working hours...
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <section
              key={day.dayOfWeek}
              className="grid items-center gap-5 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:grid-cols-[170px_115px_minmax(0,1fr)_auto]"
            >
              <div>
                <h3 className="font-bold text-[#15224D]">
                  {day.dayName}
                </h3>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={day.isAvailable}
                  onChange={(event) =>
                    updateDay(day.dayOfWeek, {
                      isAvailable: event.target.checked,
                    })
                  }
                  className="size-5 accent-blue-600"
                />
                {day.isAvailable ? "Working" : "Closed"}
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label
                    htmlFor={`start-${day.dayOfWeek}`}
                    className="mb-1 block text-xs text-slate-500"
                  >
                    Start
                  </label>
                  <input
                    id={`start-${day.dayOfWeek}`}
                    type="time"
                    value={day.startTime}
                    disabled={!day.isAvailable}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, {
                        startTime: event.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <span className="mt-5 text-slate-400">to</span>

                <div>
                  <label
                    htmlFor={`end-${day.dayOfWeek}`}
                    className="mb-1 block text-xs text-slate-500"
                  >
                    End
                  </label>
                  <input
                    id={`end-${day.dayOfWeek}`}
                    type="time"
                    value={day.endTime}
                    disabled={!day.isAvailable}
                    onChange={(event) =>
                      updateDay(day.dayOfWeek, {
                        endTime: event.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={savingDay !== null}
                onClick={() => void saveDay(day)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={17} />
                {savingDay === day.dayOfWeek ? "Saving..." : "Save"}
              </button>
            </section>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-white p-6">
        <Clock3 className="mt-1 shrink-0 text-blue-600" size={23} />
        <p className="text-sm leading-7 text-slate-600">
          Changes to working hours may affect future appointment
          availability. Existing confirmed bookings must be
          handled according to the backend's scheduling policy.
        </p>
      </div>
    </main>
  );
}
