
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
    loginDoctorController,
    getDoctorSessionController,
    logoutDoctorController
} from "./auth.controller.js";

import {
    requireDoctor,
    requireDoctorCsrf
} from "../../middleware/requireDoctor.js";

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Try again later."
    }
});

router.post("/login", loginLimiter, loginDoctorController);

router.get(
    "/session",
    requireDoctor,
    getDoctorSessionController
);

router.post(
    "/logout",
    requireDoctor,
    requireDoctorCsrf,
    logoutDoctorController
);

export default router;



