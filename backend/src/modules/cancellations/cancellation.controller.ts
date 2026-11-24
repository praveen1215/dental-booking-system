
import type {
    Request,
    Response,
    NextFunction
} from "express";

import {
    cancelAppointment,
    CancellationError
} from "./cancellation.service.js";

export async function cancelAppointmentController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const rawId = req.params.id;

        const appointmentId =
            typeof rawId === "string" ? rawId : "";

        if (
            !/^[1-9]\d*$/.test(appointmentId) ||
            BigInt(appointmentId) > 9223372036854775807n
        ) {
            return res.status(400).json({
                message: "Invalid appointment ID."
            });
        }

        const { reason } = req.body ?? {};

        if (
            typeof reason !== "string" ||
            reason.trim().length === 0 ||
            reason.trim().length > 1000
        ) {
            return res.status(400).json({
                message:
                    "Cancellation reason must contain 1 to 1000 characters."
            });
        }

        const doctorId = req.session.doctorId;

        if (!doctorId) {
            return res.status(401).json({
                message: "Doctor authentication required."
            });
        }

        const result = await cancelAppointment(
            appointmentId,
            doctorId,
            reason.trim()
        );

        return res.status(200).json({
            message: "Appointment cancelled successfully.",
            appointment: result
        });

    } catch (error) {
        if (error instanceof CancellationError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        next(error);
    }
}
