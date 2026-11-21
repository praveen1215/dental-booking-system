import type { Request, Response, NextFunction } from "express";
import { getAllDentalServices } from "./service.service.js";

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