
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@heroui/react";

type DentalService = {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
};

type BookingResult = {
  appointmentId: string;
  bookingReference: string;
  patientName: string;
  dentalService: string;
  date: string;
  time: string;
  status: string;
};

type PatientForm = {
  patientName: string;
  email: string;
  number: string;
};

const CLINIC_TIMEZONE = "Asia/Colombo";

function todayInClinic(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatDate(date: string): string {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (body && typeof body === "object") {
      const data = body as {
        message?: unknown;
        error?: unknown;
      };

      if (typeof data.message === "string") {
        return data.message;
      }

      if (typeof data.error === "string") {
        return data.error;
      }
    }
  } catch {
    // Use the fallback message.
  }

  return fallback;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function BookingPage() {
  const [services, setServices] = useState<DentalService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [patient, setPatient] = useState<PatientForm>({
    patientName: "",
    email: "",
    number: "",
  });

  const [error, setError] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  const selectedService = services.find(
    (service) => service.serviceId === serviceId
  );

  // Load dental services from the backend.
  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const response = await fetch("/clinic-api/services", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(
              response,
              "Unable to load dental services."
            )
          );
        }

        const result: unknown = await response.json();

        // Support an array or a common API response wrapper.
        const rawServices = Array.isArray(result)
          ? result
          : result && typeof result === "object"
            ? (
                result as {
                  data?: unknown;
                  services?: unknown;
                }
              ).data ??
              (
                result as {
                  services?: unknown;
                }
              ).services
            : null;

        if (!Array.isArray(rawServices)) {
          throw new Error("Unexpected dental services response.");
        }

        const parsed: DentalService[] = rawServices
          .filter(
            (item): item is Record<string, unknown> =>
              item !== null && typeof item === "object"
          )
          .map((item) => ({
            serviceId: String(item.serviceId ?? ""),
            serviceName: String(item.serviceName ?? ""),
            durationMinutes: Number(item.durationMinutes),
          }))
          .filter(
            (item) =>
              item.serviceId !== "" &&
              item.serviceName !== "" &&
              Number.isFinite(item.durationMinutes) &&
              item.durationMinutes > 0
          );

        setServices(parsed);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Could not load dental services."
        );
      } finally {
        if (!controller.signal.aborted) {
          setServicesLoading(false);
        }
      }
    }

    void loadServices();

    return () => controller.abort();
  }, []);

  // Refresh slots whenever the date or service changes.
  useEffect(() => {
    setSelectedTime("");
    setSlots([]);
    setSlotsError("");

    if (!serviceId || !date) {
      setSlotsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadSlots() {
      setSlotsLoading(true);

      try {
        const params = new URLSearchParams({
          date,
          serviceId,
        });

        const response = await fetch(
          `/clinic-api/appointments/available-slots?${params}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(
              response,
              "Unable to load available appointments."
            )
          );
        }

        const result: unknown = await response.json();

        if (
          !result ||
          typeof result !== "object" ||
          !("availableSlots" in result) ||
          !Array.isArray(result.availableSlots)
        ) {
          throw new Error("Unexpected available slots response.");
        }

        const times = result.availableSlots.filter(
          (slot): slot is string =>
            typeof slot === "string" &&
            /^([01]\d|2[0-3]):[0-5]\d$/.test(slot)
        );

        if (!controller.signal.aborted) {
          setSlots(times);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setSlotsError(
          err instanceof Error
            ? err.message
            : "Could not load appointment times."
        );
      } finally {
        if (!controller.signal.aborted) {
          setSlotsLoading(false);
        }
      }
    }

    void loadSlots();

    return () => controller.abort();
  }, [serviceId, date]);

  function updatePatient(
    key: keyof PatientForm,
    value: string
  ) {
    setPatient((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function submitBooking(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!selectedService || !date || !selectedTime) {
      setError("Please select a service, date and time.");
      return;
    }

    if (
      !patient.patientName.trim() ||
      !patient.email.trim() ||
      !patient.number.trim()
    ) {
      setError("Please complete all patient details.");
      return;
    }

    if (date < todayInClinic()) {
      setError("Please choose a future appointment date.");
      return;
    }

    setSubmitting(true);

    try {
      // Match the existing Express CreateAppointmentDTO.
      const payload = {
        patientName: patient.patientName.trim(),
        email: patient.email.trim(),
        number: patient.number.trim(),
        dentalService: selectedService.serviceName,
        date,
        time: selectedTime,
      };

      const response = await fetch(
        "/clinic-api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            response.status === 409
              ? "This appointment time is no longer available. Please choose another."
              : "Appointment booking failed."
          )
        );
      }

      const result: BookingResult = await response.json();

      setBooking(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete your booking."
      );

      // Clear the selected time after a failed booking.
      // Re-fetch slots so the patient can choose again.
      setSelectedTime("");

      if (serviceId && date) {
        try {
          const params = new URLSearchParams({
            date,
            serviceId,
          });

          const response = await fetch(
            `/clinic-api/appointments/available-slots?${params}`,
            { cache: "no-store" }
          );

          if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result.availableSlots)) {
              setSlots(result.availableSlots);
            }
          }
        } catch {
          // Preserve the main booking error.
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Confirmation screen
  if (booking) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f7f9ff] px-5 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl shadow-blue-100/50 sm:p-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={42} />
          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-[#15224D]">
            Appointment Confirmed
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Your appointment has been booked successfully.
            A confirmation email has been queued for delivery.
          </p>

          <div className="mt-8 space-y-4 rounded-2xl bg-blue-50 p-6 text-left">
            <div>
              <p className="text-xs text-slate-500">
                Booking Reference
              </p>
              <p className="mt-1 break-all text-xl font-bold text-blue-700">
                {booking.bookingReference}
              </p>
            </div>

            <div className="border-t border-blue-100 pt-4">
              <p className="text-xs text-slate-500">
                Patient
              </p>
              <p className="font-semibold">
                {booking.patientName}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Service
              </p>
              <p className="font-semibold">
                {booking.dentalService}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Date and Time
              </p>
              <p className="font-semibold">
                {formatDate(booking.date)} at{" "}
                {formatTime(booking.time)}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            className="mt-8 w-full rounded-xl bg-blue-600 text-white"
            onPress={() => window.location.assign("/book")}
          >
            Make Another Booking
          </Button>

          <Link
            href="/"
            className="mt-5 block text-sm font-semibold text-blue-600"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9ff] text-slate-900">
      {/* Page heading */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 py-16 sm:py-20">
        <div className="absolute -right-16 -top-24 size-64 rounded-full bg-cyan-100" />
        <div className="absolute bottom-[-120px] right-[25%] size-56 rounded-full bg-yellow-100" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-600">
            <CalendarDays size={17} />
            Online Dental Appointment
          </div>

          <h1 className="mt-6 text-4xl font-extrabold text-[#15224D] sm:text-5xl">
            Book Your{" "}
            <span className="text-blue-600">
              Dental Appointment
            </span>
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-slate-600">
            Choose your dental service, select a date, and
            find an available time. Then provide your details
            to confirm your visit.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Booking form */}
        <form
          onSubmit={(event) => void submitBooking(event)}
          className="space-y-8"
        >
          {/* STEP 1: Dental service */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                01
              </span>

              <div>
                <h2 className="text-xl font-bold text-[#15224D]">
                  Select Dental Service
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Which treatment would you like?
                </p>
              </div>
            </div>

            <label
              htmlFor="dental-service"
              className="text-sm font-semibold text-slate-700"
            >
              Dental Service
            </label>

            <select
              id="dental-service"
              required
              value={serviceId}
              disabled={servicesLoading}
              onChange={(event) => {
                setServiceId(event.target.value);
                setError("");
              }}
              className={inputClass}
            >
              <option value="">
                {servicesLoading
                  ? "Loading services..."
                  : "Choose a dental service"}
              </option>

              {services.map((service) => (
                <option
                  key={service.serviceId}
                  value={service.serviceId}
                >
                  {service.serviceName} —{" "}
                  {service.durationMinutes} minutes
                </option>
              ))}
            </select>

            {selectedService && (
              <p className="mt-3 flex items-center gap-2 text-sm text-blue-700">
                <Clock3 size={16} />
                Duration: {selectedService.durationMinutes} minutes
              </p>
            )}

            {!servicesLoading && services.length === 0 && (
              <p className="mt-3 text-sm text-amber-700">
                No dental services could be loaded.
                Check that the backend is running.
              </p>
            )}
          </div>

          {/* STEP 2: Date and time */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                02
              </span>

              <div>
                <h2 className="text-xl font-bold text-[#15224D]">
                  Choose Date & Time
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Only available times will be displayed.
                </p>
              </div>
            </div>

            <label
              htmlFor="appointment-date"
              className="text-sm font-semibold text-slate-700"
            >
              Appointment Date
            </label>

            <input
              id="appointment-date"
              type="date"
              required
              min={todayInClinic()}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setError("");
              }}
              className={inputClass}
            />

            <div className="mt-8">
              <p className="mb-4 text-sm font-semibold text-slate-700">
                Available Appointment Times
              </p>

              {!serviceId || !date ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Select a service and a date to view times.
                </div>
              ) : slotsLoading ? (
                <div
                  role="status"
                  className="rounded-2xl bg-blue-50 p-6 text-center text-sm text-blue-700"
                >
                  Checking available appointments...
                </div>
              ) : slotsError ? (
                <div role="alert" className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">
                  {slotsError}
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-2xl bg-amber-50 p-6 text-center text-sm text-amber-800">
                  No available times for this date.
                  Please choose another day.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slots.map((time) => {
                    const active = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                            : "border-blue-200 bg-blue-50/50 text-blue-800 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Patient details */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                03
              </span>

              <div>
                <h2 className="text-xl font-bold text-[#15224D]">
                  Patient Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Please provide your contact information.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="patient-name"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <UserRound size={16} />
                  Full Name
                </label>

                <input
                  id="patient-name"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={patient.patientName}
                  onChange={(event) =>
                    updatePatient(
                      "patientName",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="patient-email"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Mail size={16} />
                  Email Address
                </label>

                <input
                  id="patient-email"
                  type="email"
                  required
                  maxLength={255}
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={patient.email}
                  onChange={(event) =>
                    updatePatient("email", event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="patient-phone"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Phone size={16} />
                  Phone Number
                </label>

                <input
                  id="patient-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+94 77 123 4567"
                  value={patient.number}
                  onChange={(event) =>
                    updatePatient("number", event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isDisabled={
              submitting ||
              servicesLoading ||
              slotsLoading ||
              Boolean(slotsError) ||
              !selectedService ||
              !selectedTime
            }
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700"
          >
            {submitting
              ? "Confirming Appointment..."
              : "Confirm Appointment"}

            {!submitting && <ArrowRight size={18} />}
          </Button>

          <p className="text-center text-xs leading-6 text-slate-500">
            Appointment availability is checked again
            when you submit your booking.
          </p>
        </form>

        {/* Booking summary */}
        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CalendarDays size={23} />
              </span>

              <h2 className="text-xl font-bold text-[#15224D]">
                Booking Summary
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Service
                </p>
                <p className="mt-2 font-semibold text-slate-800">
                  {selectedService?.serviceName ??
                    "Not selected"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Duration
                </p>
                <p className="mt-2 font-semibold">
                  {selectedService
                    ? `${selectedService.durationMinutes} minutes`
                    : "Not selected"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Date
                </p>
                <p className="mt-2 font-semibold">
                  {date ? formatDate(date) : "Not selected"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Time
                </p>
                <p className="mt-2 font-semibold text-blue-700">
                  {selectedTime
                    ? formatTime(selectedTime)
                    : "Not selected"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-blue-50 p-4">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <p className="text-xs leading-6 text-blue-900">
                Select an available appointment time.
                You will receive a booking reference
                after successful confirmation.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-[#15224D] p-7 text-white">
            <CheckCircle2 size={28} className="text-cyan-300" />

            <h3 className="mt-4 text-lg font-bold">
              Simple Online Booking
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Choose a suitable time and book your dental
              visit without calling the clinic.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
