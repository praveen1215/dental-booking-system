
import { Router } from "express";

import {
    requireDoctor
} from "../../middleware/requireDoctor.js";

import {
    getDoctorAppointmentsController
} from "./appointment.controller.js";

const router = Router();

// Protect all routes in this file
router.use(requireDoctor);

// Doctor views appointments
router.get("/", getDoctorAppointmentsController);

export default router;
