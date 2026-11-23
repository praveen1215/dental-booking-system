
import { Router } from "express";

import {
    createAppointmentController,
    getAvailableAppointmentSlotsController
} from "./appointment.controller.js";

const router = Router();

// Public: Get available appointment slots
router.get(
    "/available-slots",
    getAvailableAppointmentSlotsController
);

// Public: Book an appointment
router.post(
    "/",
    createAppointmentController
);

export default router;
