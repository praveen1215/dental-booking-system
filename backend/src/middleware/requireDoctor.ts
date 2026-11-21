import type {
    Request,
    Response,
    NextFunction
} from "express";

import { timingSafeEqual } from "node:crypto";

export function requireDoctor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.session.doctorId) {
        return res.status(401).json({
            message: "Doctor authentication required."
        });
    }

    next();
}

export function requireDoctorCsrf(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const expected = req.session.csrfToken;
    const received = req.header("X-CSRF-Token");

    if (!expected || !received) {
        return res.status(403).json({
            message: "Invalid CSRF token."
        });
    }

    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(received);

    if (
        expectedBuffer.length !== receivedBuffer.length ||
        !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
        return res.status(403).json({
            message: "Invalid CSRF token."
        });
    }

    next();
}
