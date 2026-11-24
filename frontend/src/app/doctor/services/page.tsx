
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Plus,
  RefreshCw,
  Clock3,
} from "lucide-react";
import {
  DOCTOR_API,
  doctorRequest,
} from "@/lib/doctor-api";

type Service = {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
};

function extractServices(result: unknown): Service[] {
  let raw: unknown = result;

  if (result && typeof result === "object" && !Array.isArray(result)) {
    const wrapper = result as {
      data?: unknown;
      services?: unknown;
    };

    raw = wrapper.data ?? wrapper.services;
  }

  if (!Array.isArray(raw)) {
    throw new Error("Unexpected services response format.");
  }

  return raw.map((item) => {
    const service = item as Record<string, unknown>;

    return {
      serviceId: String(service.serviceId ?? ""),
      serviceName: String(service.serviceName ?? ""),
      durationMinutes: Number(service.durationMinutes),
    };
  });
}

export default function DoctorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await doctorRequest<unknown>(
        DOCTOR_API.services
      );

      setServices(extractServices(result));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  async function createService(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const durationNumber = Number(duration);

    if (!name.trim() || !Number.isInteger(durationNumber) || durationNumber <= 0) {
      setError("Enter a service name and a valid duration.");
      return;
    }

    setSaving(true);

    try {
      await doctorRequest(
        DOCTOR_API.createService,
        {
          method: "POST",
          body: JSON.stringify({
            serviceName: name.trim(),
            durationMinutes: durationNumber,
          }),
        }
      );

      setSuccess("Dental service created successfully.");
      setName("");
      setDuration("30");

      await loadServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create service."
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
          Manage Dental Services
        </h1>

        <p className="mt-3 text-slate-500">
          Create dental treatments and set how long each appointment takes.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-start">
        <section className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Plus size={24} />
            </span>
            <h2 className="text-xl font-bold text-[#15224D]">
              Create New Service
            </h2>
          </div>

          <form onSubmit={(event) => void createService(event)} className="mt-8 space-y-6">
            <div>
              <label htmlFor="service-name" className="text-sm font-semibold text-slate-700">
                Service Name
              </label>
              <input
                id="service-name"
                type="text"
                required
                maxLength={100}
                placeholder="Example: Teeth Cleaning"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="service-duration" className="text-sm font-semibold text-slate-700">
                Duration (Minutes)
              </label>
              <input
                id="service-duration"
                type="number"
                required
                min={1}
                max={480}
                step={1}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={18} />
              {saving ? "Creating..." : "Create Service"}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-blue-100 p-7">
            <div className="flex items-center gap-3">
              <ClipboardList size={25} className="text-blue-600" />
              <h2 className="text-xl font-bold text-[#15224D]">
                Current Services
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void loadServices()}
              disabled={loading}
              aria-label="Refresh services"
              className="rounded-lg border border-blue-100 p-2 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw size={19} />
            </button>
          </div>

          {loading ? (
            <p className="p-8 text-slate-500">Loading dental services...</p>
          ) : services.length === 0 ? (
            <p className="p-8 text-slate-500">No dental services found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {services.map((service) => (
                <div
                  key={service.serviceId}
                  className="flex items-center justify-between gap-4 p-6"
                >
                  <div>
                    <h3 className="font-semibold text-[#15224D]">
                      {service.serviceName}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={15} />
                      {service.durationMinutes} minutes
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Service
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {(error || success) && (
        <div
          role={error ? "alert" : "status"}
          className={`mt-6 rounded-xl p-4 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {error || success}
        </div>
      )}
    </main>
  );
}
