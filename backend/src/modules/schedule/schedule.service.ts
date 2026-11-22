
import { AppDataSource } from "../../config/data_source.js";

export async function getDoctorSchedule(doctorId: string) {
    const weekly = await AppDataSource.query(
        `SELECT * FROM doctor_schedules
         WHERE "doctorId" = $1
         ORDER BY "dayOfWeek", "startTime"`,
        [doctorId]
    );

    const overrides = await AppDataSource.query(
        `SELECT * FROM doctor_schedule_overrides
         WHERE "doctorId" = $1
         ORDER BY "overrideDate"`,
        [doctorId]
    );

    const unavailability = await AppDataSource.query(
        `SELECT * FROM doctor_unavailability
         WHERE "doctorId" = $1
         ORDER BY "startTime"`,
        [doctorId]
    );

    return { weekly, overrides, unavailability };
}

export async function setWeeklySchedule(
    doctorId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string
) {
    const result = await AppDataSource.query(
        `WITH removed AS (
            DELETE FROM doctor_schedules
            WHERE "doctorId" = $1
              AND "dayOfWeek" = $2
            RETURNING 1
        )
        INSERT INTO doctor_schedules
            ("doctorId", "dayOfWeek", "startTime", "endTime")
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [doctorId, dayOfWeek, startTime, endTime]
    );

    return result[0];
}

export async function removeWeeklySchedule(
    doctorId: string,
    dayOfWeek: number
) {
    return AppDataSource.query(
        `DELETE FROM doctor_schedules
         WHERE "doctorId" = $1
           AND "dayOfWeek" = $2
         RETURNING *`,
        [doctorId, dayOfWeek]
    );
}

export async function setScheduleOverride(
    doctorId: string,
    overrideDate: string,
    isClosed: boolean,
    startTime: string | null,
    endTime: string | null
) {
    const rows = await AppDataSource.query(
        `INSERT INTO doctor_schedule_overrides
            ("doctorId", "overrideDate", "isClosed",
             "startTime", "endTime")
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT ("doctorId", "overrideDate")
         DO UPDATE SET
            "isClosed" = EXCLUDED."isClosed",
            "startTime" = EXCLUDED."startTime",
            "endTime" = EXCLUDED."endTime"
         RETURNING *`,
        [
            doctorId, overrideDate, isClosed,
            startTime, endTime
        ]
    );

    return rows[0];
}

export async function removeScheduleOverride(
    doctorId: string,
    overrideDate: string
) {
    return AppDataSource.query(
        `DELETE FROM doctor_schedule_overrides
         WHERE "doctorId" = $1
           AND "overrideDate" = $2
         RETURNING *`,
        [doctorId, overrideDate]
    );
}

export async function createUnavailability(
    doctorId: string,
    startTime: string,
    endTime: string,
    reason: string | null
) {
    const rows = await AppDataSource.query(
        `INSERT INTO doctor_unavailability
            ("doctorId", "startTime", "endTime", "reason")
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [doctorId, startTime, endTime, reason]
    );

    return rows[0];
}

export async function removeUnavailability(
    doctorId: string,
    unavailabilityId: string
) {
    return AppDataSource.query(
        `DELETE FROM doctor_unavailability
         WHERE "doctorId" = $1
           AND "unavailabilityId" = $2
         RETURNING *`,
        [doctorId, unavailabilityId]
    );
}
