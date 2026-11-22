
import { randomBytes } from "node:crypto";
import { DateTime, IANAZone } from "luxon";

import { AppDataSource } from "../../config/data_source.js";
import { Patient } from "../../entities/Patient.js";
import { Doctor } from "../../entities/Doctor.js";
import { DentalService } from "../../entities/DentalService.js";
import { Appointment } from "../../entities/Appointment.js";

import type {
    CreateAppointmentDTO,
    AppointmentResult
} from "./appointment.types.js";

import { AppointmentError } from "./appointment.types.js";

const clinicTimezone =
    process.env.CLINIC_TIMEZONE ?? "Asia/Colombo";

if (!IANAZone.isValidZone(clinicTimezone)) {
    throw new Error("Invalid CLINIC_TIMEZONE in .env");
}

function createBookingReference(): string {
    return "DEN-" + randomBytes(8).toString("hex").toUpperCase();
}

function validateInput(data: CreateAppointmentDTO) {
    if (
        typeof data.patientName !== "string" ||
        !data.patientName.trim() ||
        data.patientName.trim().length > 100
    ) {
        throw new AppointmentError(400, "Invalid patient name.");
    }

    if (
        typeof data.number !== "string" ||
        !/^[+0-9()\s-]{7,20}$/.test(data.number.trim())
    ) {
        throw new AppointmentError(400, "Invalid phone number.");
    }

    if (
        typeof data.email !== "string" ||
        data.email.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    ) {
        throw new AppointmentError(400, "Invalid email address.");
    }

    if (
        typeof data.dentalService !== "string" ||
        !data.dentalService.trim() ||
        data.dentalService.length > 100
    ) {
        throw new AppointmentError(400, "Invalid dental service.");
    }

    if (
        typeof data.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
        typeof data.time !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)
    ) {
        throw new AppointmentError(
            400,
            "Use YYYY-MM-DD for date and HH:MM for time."
        );
    }
}

function checkTimeWithinHours(
    requestedStart: string,
    requestedEnd: string,
    workingStart: string,
    workingEnd: string
): boolean {
    return (
        requestedStart >= workingStart.slice(0, 5) &&
        requestedEnd <= workingEnd.slice(0, 5)
    );
}

export async function createAppointment(
    input: CreateAppointmentDTO
): Promise<AppointmentResult> {
    validateInput(input);

    const startLocal = DateTime.fromISO(
        `${input.date}T${input.time}`,
        { zone: clinicTimezone }
    );

    if (
        !startLocal.isValid ||
        startLocal.toFormat("yyyy-MM-dd") !== input.date ||
        startLocal.toFormat("HH:mm") !== input.time
    ) {
        throw new AppointmentError(400, "Invalid appointment date or time.");
    }

    if (startLocal.toUTC() <= DateTime.utc()) {
        throw new AppointmentError(
            400,
            "Appointments must be booked in the future."
        );
    }

    return AppDataSource.transaction(async (manager) => {
        // Serialize appointment creation for this single-doctor clinic.
        // Every booking must use this transaction for the lock to work.
        await manager.query(
            "SELECT pg_advisory_xact_lock(72492015)"
        );

        const doctors = await manager
            .getRepository(Doctor)
            .find({ take: 1 });

        const doctor = doctors[0];

        if (!doctor) {
            throw new AppointmentError(
                503,
                "No doctor is configured for bookings."
            );
        }

        const service = await manager
            .getRepository(DentalService)
            .findOneBy({
                serviceName: input.dentalService.trim()
            });

        if (!service) {
            throw new AppointmentError(
                404,
                "Selected dental service does not exist."
            );
        }

        const endLocal = startLocal.plus({
            minutes: service.durationMinutes
        });

        if (
            endLocal.toFormat("yyyy-MM-dd") !== input.date
        ) {
            throw new AppointmentError(
                409,
                "The appointment extends beyond the selected date."
            );
        }

        const startUtc = startLocal.toUTC().toJSDate();
        const endUtc = endLocal.toUTC().toJSDate();

        const overrides = await manager.query(
            `SELECT *
             FROM doctor_schedule_overrides
             WHERE "doctorId" = $1
               AND "overrideDate" = $2::date`,
            [doctor.doctorId, input.date]
        );

        let workingHoursValid = false;

        if (overrides.length > 0) {
            const override = overrides[0];

            if (override.isClosed) {
                throw new AppointmentError(
                    409,
                    "The clinic is closed on the selected date."
                );
            }

            workingHoursValid = checkTimeWithinHours(
                startLocal.toFormat("HH:mm"),
                endLocal.toFormat("HH:mm"),
                override.startTime,
                override.endTime
            );
        } else {
            const dayOfWeek = startLocal.weekday % 7;

            const schedules = await manager.query(
                `SELECT "startTime", "endTime"
                 FROM doctor_schedules
                 WHERE "doctorId" = $1
                   AND "dayOfWeek" = $2`,
                [doctor.doctorId, dayOfWeek]
            );

            workingHoursValid = schedules.some(
                (schedule: {
                    startTime: string;
                    endTime: string;
                }) =>
                    checkTimeWithinHours(
                        startLocal.toFormat("HH:mm"),
                        endLocal.toFormat("HH:mm"),
                        schedule.startTime,
                        schedule.endTime
                    )
            );
        }

        if (!workingHoursValid) {
            throw new AppointmentError(
                409,
                "Selected time is outside the doctor's working hours."
            );
        }

        const unavailable = await manager.query(
            `SELECT 1
             FROM doctor_unavailability
             WHERE "doctorId" = $1
               AND "startTime" < $3
               AND "endTime" > $2
             LIMIT 1`,
            [doctor.doctorId, startUtc, endUtc]
        );

        if (unavailable.length > 0) {
            throw new AppointmentError(
                409,
                "The doctor is unavailable during this period."
            );
        }

        const overlappingAppointments = await manager.query(
            `SELECT 1
             FROM appointments
             WHERE "doctorId" = $1
               AND "status" = 'confirmed'
               AND "startTime" < $3
               AND "endTime" > $2
             LIMIT 1`,
            [doctor.doctorId, startUtc, endUtc]
        );

        if (overlappingAppointments.length > 0) {
            throw new AppointmentError(
                409,
                "This time slot is already booked."
            );
        }

        // Guest booking: create a patient record.
        // Do not merge patients automatically using only email or phone.
        const patient = manager.getRepository(Patient).create({
            patientName: input.patientName.trim(),
            email: input.email.trim(),
            phone: input.number.trim()
        });

        const savedPatient = await manager
            .getRepository(Patient)
            .save(patient);

        const appointment = manager
            .getRepository(Appointment)
            .create({
                bookingReference: createBookingReference(),
                patient: savedPatient,
                doctor,
                dentalService: service,
                startTime: startUtc,
                endTime: endUtc,
                status: "confirmed"
            });

        const savedAppointment = await manager
            .getRepository(Appointment)
            .save(appointment);

        return {
            appointmentId: savedAppointment.appointmentId,
            bookingReference: savedAppointment.bookingReference,
            patientName: savedPatient.patientName,
            email: savedPatient.email,
            number: savedPatient.phone,
            dentalService: service.serviceName,
            date: input.date,
            time: input.time,
            startTime: startUtc.toISOString(),
            endTime: endUtc.toISOString(),
            status: "confirmed"
        };
    });
}
