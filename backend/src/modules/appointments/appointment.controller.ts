
import type {
    Request,
    Response,
    NextFunction
} from "express";

import { createAppointment,getDoctorAppointments,getAvailableAppointmentSlots } from "./appointment.service.js";
import { AppointmentError } from "./appointment.types.js";

export async function createAppointmentController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const appointment = await createAppointment(req.body);

        return res.status(201).json({
            message: "Appointment booked successfully.",
            appointment
        });
    } catch (error) {
        if (error instanceof AppointmentError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        // PostgreSQL unique constraint violation
        if (
            typeof error === "object" &&
            error !== null &&
            "driverError" in error
        ) {
            const databaseError = error.driverError as {
                code?: string;
            };

            if (databaseError.code === "23505") {
                return res.status(409).json({
                    message: "A booking conflict occurred. Please try again."
                });
            }
        }

        next(error);
    }
}

export async function getDoctorAppointmentsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const doctorId = req.session.doctorId;

        if (!doctorId) {
            return res.status(401).json({
                message: "Doctor authentication required."
            });
        }

        const pageInput = req.query.page ?? "1";
        const limitInput = req.query.limit ?? "20";

        if (
            typeof pageInput !== "string" ||
            typeof limitInput !== "string" ||
            !/^[1-9]\d*$/.test(pageInput) ||
            !/^[1-9]\d*$/.test(limitInput)
        ) {
            return res.status(400).json({
                message: "Invalid pagination parameters."
            });
        }

        const page = Number(pageInput);
        const limit = Number(limitInput);

        if (
            !Number.isSafeInteger(page) ||
            !Number.isSafeInteger(limit) ||
            limit > 100 ||
            (page - 1) * limit > 100000
        ) {
            return res.status(400).json({
                message: "Invalid page or limit."
            });
        }

        const result = await getDoctorAppointments(
            doctorId,
            page,
            limit
        );

        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

export async function getAvailableAppointmentSlotsController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { date, serviceId } = req.query;

        if (
            typeof date !== "string" ||
            typeof serviceId !== "string"
        ) {
            res.status(400).json({
                message: "Date and serviceId are required."
            });
            return;
        }

        const result = await getAvailableAppointmentSlots(
            date,
            serviceId
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
