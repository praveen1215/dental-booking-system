
import type {
    Request,
    Response,
    NextFunction
} from "express";

import {
    getAllDentalServices,
    createDentalService,
    updateDentalServiceDuration
} from "./service.service.js";

function isValidDuration(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isSafeInteger(value) &&
        value >= 1 &&
        value <= 1440
    );
}

function isUniqueConstraintError(error: unknown): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const dbError = error as {
        driverError?: { code?: string };
    };

    return dbError.driverError?.code === "23505";
}

// GET: List dental services
export async function getAllDentalServicesController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const services = await getAllDentalServices();

        return res.status(200).json(services);
    } catch (error) {
        next(error);
    }
}

// POST: Create a dental service
export async function createDentalServiceController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { serviceName, durationMinutes } = req.body ?? {};

        if (
            typeof serviceName !== "string" ||
            serviceName.trim().length < 1 ||
            serviceName.trim().length > 100
        ) {
            return res.status(400).json({
                message: "Service name must contain 1 to 100 characters."
            });
        }

        if (!isValidDuration(durationMinutes)) {
            return res.status(400).json({
                message: "Duration must be a whole number between 1 and 1440."
            });
        }

        const service = await createDentalService(
            serviceName,
            durationMinutes
        );

        return res.status(201).json({
            message: "Dental service created successfully.",
            service
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            return res.status(409).json({
                message: "A dental service with this name already exists."
            });
        }

        next(error);
    }
}

// PATCH: Update a service duration
export async function updateDentalServiceController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const rawId = req.params.id;
        const serviceId = typeof rawId === "string" ? rawId : "";

        if (
            !/^[1-9][0-9]*$/.test(serviceId) ||
            BigInt(serviceId) > 9223372036854775807n
        ) {
            return res.status(400).json({
                message: "Invalid service ID."
            });
        }

        const { durationMinutes } = req.body ?? {};

        if (!isValidDuration(durationMinutes)) {
            return res.status(400).json({
                message: "Duration must be a whole number between 1 and 1440."
            });
        }

        const service = await updateDentalServiceDuration(
            serviceId,
            durationMinutes
        );

        if (!service) {
            return res.status(404).json({
                message: "Dental service not found."
            });
        }

        return res.status(200).json({
            message: "Dental service updated successfully.",
            service
        });
    } catch (error) {
        next(error);
    }
}
