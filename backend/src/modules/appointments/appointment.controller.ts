
import type {
    Request,
    Response,
    NextFunction
} from "express";

import { createAppointment } from "./appointment.service.js";
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
