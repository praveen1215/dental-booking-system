
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Plus,
  RefreshCw,
  Clock3,
  Pencil,
  Save,
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
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [updating, setUpdating] = useState(false);


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
    function startEditing(service: Service) {
    setEditingService(service);
    setEditName(service.serviceName);
    setEditDuration(String(service.durationMinutes));
    setError("");
    setSuccess("");
    }

    function stopEditing() {
    setEditingService(null);
    setEditName("");
    setEditDuration("");
    }

        async function updateService(
        event: React.FormEvent<HTMLFormElement>
        ) {
        event.preventDefault();

        if (!editingService) return;

        setError("");
        setSuccess("");

        const durationNumber = Number(editDuration);

        if (
            !editName.trim() ||
            !Number.isInteger(durationNumber) ||
            durationNumber <= 0
        ) {
            setError("Enter a valid service name and duration.");
            return;
        }

        setUpdating(true);

        try {
            await doctorRequest(
            `${DOCTOR_API.createService}/${encodeURIComponent(
                editingService.serviceId
            )}`,
            {
                method: "PATCH",
                body: JSON.stringify({
                durationMinutes: durationNumber,
                }),
            }
            );

            stopEditing();

            await loadServices();

            setSuccess("Dental service updated successfully.");
        } catch (err) {
            setError(
            err instanceof Error
                ? err.message
                : "Unable to update dental service."
            );
        } finally {
            setUpdating(false);
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

                 <button
                    type="button"
                    onClick={() => startEditing(service)}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                    <Pencil size={16} />
                    Edit
                    </button>
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


{editingService && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-service-title"
      className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Pencil size={26} />
      </div>

      <h2
        id="edit-service-title"
        className="mt-5 text-2xl font-bold text-[#15224D]"
      >
        Edit Dental Service
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Update the service information without creating
        a duplicate service.
      </p>

      <form
        onSubmit={(event) => void updateService(event)}
        className="mt-7 space-y-5"
      >
        <div>
          <label
            htmlFor="edit-service-name"
            className="text-sm font-semibold text-slate-700"
          >
            Service Name
          </label>

          <input
            id="edit-service-name"
            type="text"
            value={editName}
            readOnly
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="edit-service-duration"
            className="text-sm font-semibold text-slate-700"
          >
            Duration (Minutes)
          </label>

          <input
            id="edit-service-duration"
            type="number"
            required
            min={1}
            max={480}
            step={1}
            value={editDuration}
            onChange={(event) => setEditDuration(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={stopEditing}
            disabled={updating}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updating}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={17} />
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
  </main>
 );
}
