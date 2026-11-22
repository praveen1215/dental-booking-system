
import express from "express";
import cors from "cors";

import healthRouter from "./modules/health/health.routes.js";
import appointmentRouter from "./modules/appointments/appointement.routes.js";
import serviceRouter from "./modules/services/service.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import doctorServiceRouter from "./modules/doctor/doctor.service.routes.js";
import { sessionMiddleware } from "./config/session.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));

// Validate browser origins for state-changing requests.
app.use((req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        return next();
    }

    const origin = req.header("Origin");

    if (origin && origin !== frontendUrl) {
        return res.status(403).json({
            message: "Request origin not allowed."
        });
    }

    next();
});

app.use(sessionMiddleware);

app.use("/api", healthRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/services", serviceRouter);
app.use("/api/auth", authRouter);
app.use("/api/doctor/services", doctorServiceRouter);



app.use((
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    console.error("API error:", error);

    if (res.headersSent) {
        return next(error);
    }

    return res.status(500).json({
        message: "An unexpected server error occurred."
    });
});

export default app;
