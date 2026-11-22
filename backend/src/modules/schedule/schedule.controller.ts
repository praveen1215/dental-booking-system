
import type { Request, Response, NextFunction } from "express";

import {
    getDoctorSchedule,
    setWeeklySchedule,
    removeWeeklySchedule,
    setScheduleOverride,
    removeScheduleOverride,
    createUnavailability,
    removeUnavailability
} from "./schedule.service.js";

type Handler = (
    req: Request,
    res: Response
) => Promise<unknown>;

function handle(handler: Handler) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}

function doctorId(req: Request): string {
    // Routes are protected by requireDoctor.
    return req.session.doctorId!;
}

function validTime(value: unknown): value is string {
    return (
        typeof value === "string" &&
        /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
    );
}

function validDate(value: unknown): value is string {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false;
    }

    const date = new Date(`${value}T00:00:00Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

function validDateTime(value: unknown): value is string {
    return (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
        Number.isFinite(Date.parse(value))
    );
}

function validId(value: unknown): value is string {
    return (
        typeof value === "string" &&
        /^[1-9]\d*$/.test(value) &&
        BigInt(value) <= 9223372036854775807n
    );
}

function readDay(req: Request): number | null {
    const raw = req.params.dayOfWeek;

    if (
        typeof raw !== "string" ||
        !/^[0-6]$/.test(raw)
    ) {
        return null;
    }

    return Number(raw);
}

// GET: Complete doctor schedule
export const getScheduleController = handle(
    async (req, res) => {
        const schedule = await getDoctorSchedule(
            doctorId(req)
        );

        return res.status(200).json(schedule);
    }
);

// PUT: Set weekly working hours
export const setWeeklyScheduleController = handle(
    async (req, res) => {
        const day = readDay(req);

        if (day === null) {
            return res.status(400).json({
                message: "dayOfWeek must be 0 to 6."
            });
        }

        const { startTime, endTime } = req.body ?? {};

        if (
            !validTime(startTime) ||
            !validTime(endTime) ||
            startTime >= endTime
        ) {
            return res.status(400).json({
                message: "Provide valid HH:MM hours with startTime before endTime."
            });
        }

        const schedule = await setWeeklySchedule(
            doctorId(req),
            day,
            startTime,
            endTime
        );

        return res.status(200).json({
            message: "Weekly schedule saved.",
            schedule
        });
    }
);

// DELETE: Remove weekly hours
export const deleteWeeklyScheduleController = handle(
    async (req, res) => {
        const day = readDay(req);

        if (day === null) {
            return res.status(400).json({
                message: "dayOfWeek must be 0 to 6."
            });
        }

        const removed = await removeWeeklySchedule(
            doctorId(req),
            day
        );

        if (removed.length === 0) {
            return res.status(404).json({
                message: "No weekly schedule found."
            });
        }

        return res.status(200).json({
            message: "Weekly schedule removed."
        });
    }
);

// PUT: Special date or clinic closure
export const setOverrideController = handle(
    async (req, res) => {
        const date = req.params.date;

        if (!validDate(date)) {
            return res.status(400).json({
                message: "Date must be YYYY-MM-DD."
            });
        }

        const { isClosed, startTime, endTime } = req.body ?? {};

        if (typeof isClosed !== "boolean") {
            return res.status(400).json({
                message: "isClosed must be true or false."
            });
        }

        if (
            !isClosed &&
            (
                !validTime(startTime) ||
                !validTime(endTime) ||
                startTime >= endTime
            )
        ) {
            return res.status(400).json({
                message: "Open days require valid startTime and endTime."
            });
        }

        const schedule = await setScheduleOverride(
            doctorId(req),
            date,
            isClosed,
            isClosed ? null : startTime,
            isClosed ? null : endTime
        );

        return res.status(200).json({
            message: "Date override saved.",
            schedule
        });
    }
);

// DELETE: Remove date override
export const deleteOverrideController = handle(
    async (req, res) => {
        const date = req.params.date;

        if (!validDate(date)) {
            return res.status(400).json({
                message: "Invalid date."
            });
        }

        const removed = await removeScheduleOverride(
            doctorId(req),
            date
        );

        if (removed.length === 0) {
            return res.status(404).json({
                message: "Date override not found."
            });
        }

        return res.status(200).json({
            message: "Date override removed."
        });
    }
);

// POST: Block an unavailable period
export const createUnavailabilityController = handle(
    async (req, res) => {
        const {
            startTime,
            endTime,
            reason
        } = req.body ?? {};

        if (
            !validDateTime(startTime) ||
            !validDateTime(endTime) ||
            Date.parse(startTime) >= Date.parse(endTime)
        ) {
            return res.status(400).json({
                message: "Provide valid ISO date-times with timezone and endTime after startTime."
            });
        }

        if (
            reason !== undefined &&
            reason !== null &&
            (
                typeof reason !== "string" ||
                reason.length > 1000
            )
        ) {
            return res.status(400).json({
                message: "Reason must be text of at most 1000 characters."
            });
        }

        const block = await createUnavailability(
            doctorId(req),
            startTime,
            endTime,
            typeof reason === "string"
                ? reason.trim() || null
                : null
        );

        return res.status(201).json({
            message: "Unavailable period created.",
            block
        });
    }
);

// DELETE: Remove an unavailable period
export const deleteUnavailabilityController = handle(
    async (req, res) => {
        const id = req.params.id;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid unavailability ID."
            });
        }

        const removed = await removeUnavailability(
            doctorId(req),
            id
        );

        if (removed.length === 0) {
            return res.status(404).json({
                message: "Unavailable period not found."
            });
        }

        return res.status(200).json({
            message: "Unavailable period removed."
        });
    }
);
