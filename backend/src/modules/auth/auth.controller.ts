
import type {
    Request,
    Response,
    NextFunction
} from "express";

import { randomBytes } from "node:crypto";

import { AppDataSource } from "../../config/data_source.js";
import { Doctor } from "../../entities/Doctor.js";
import { verifyDoctorCredentials } from "./auth.service.js";

function regenerateSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.regenerate((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

function saveSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.save((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

function destroySession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.destroy((error) => {
            if (error) reject(error);
            else resolve();
        });
    });
}

export async function loginDoctorController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password ||
            email.length > 255 ||
            password.length > 1024
        ) {
            return res.status(400).json({
                message: "Valid email and password are required."
            });
        }

        const doctor = await verifyDoctorCredentials(
            email,
            password
        );

        if (!doctor) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Regenerate session to prevent session fixation.
        await regenerateSession(req);

        req.session.doctorId = doctor.doctorId;
        req.session.csrfToken = randomBytes(32).toString("hex");

        await saveSession(req);

        return res.status(200).json({
            message: "Login successful.",
            doctor: {
                doctorId: doctor.doctorId,
                doctorName: doctor.doctorName,
                email: doctor.email
            },
            csrfToken: req.session.csrfToken
        });

    } catch (error) {
        next(error);
    }
}

export async function getDoctorSessionController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.session.doctorId) {
            return res.status(401).json({
                authenticated: false
            });
        }

        const repository = AppDataSource.getRepository(Doctor);

        const doctor = await repository.findOneBy({
            doctorId: req.session.doctorId
        });

        if (!doctor) {
            return res.status(401).json({
                authenticated: false
            });
        }

        return res.status(200).json({
            authenticated: true,
            doctor: {
                doctorId: doctor.doctorId,
                doctorName: doctor.doctorName,
                email: doctor.email
            },
            csrfToken: req.session.csrfToken
        });

    } catch (error) {
        next(error);
    }
}

export async function logoutDoctorController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        await destroySession(req);

        res.clearCookie("dental.sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "Logout successful."
        });

    } catch (error) {
        next(error);
    }
}
