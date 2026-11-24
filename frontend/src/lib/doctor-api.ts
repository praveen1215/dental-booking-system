
export const DOCTOR_API = {
  services: "/clinic-api/services",
  createService: "/clinic-api/doctor/services",
  weeklySchedule: "/clinic-api/doctor/schedule",
  unavailability: "/clinic-api/doctor/schedule/unavailability",
} as const;

export async function doctorRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();

  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken =
      sessionStorage.getItem("doctorCsrfToken");

    if (!csrfToken) {
      throw new Error(
        "Doctor security token is missing. Please sign in again."
      );
    }

    headers.set("X-CSRF-Token", csrfToken);
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;

    try {
      const result: unknown = await response.json();

      if (result && typeof result === "object") {
        const error = result as {
          message?: string;
          error?: string;
        };

        message = error.message ?? error.error ?? message;
      }
    } catch {
      // Keep the HTTP status message.
    }

    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
