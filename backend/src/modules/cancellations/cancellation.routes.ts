
import { Router } from "express";

import {
    requireDoctor,
    requireDoctorCsrf
} from "../../middleware/requireDoctor.js";

import {
    cancelAppointmentController
} from "./cancellation.controller.js";

const router = Router();

router.use(requireDoctor);

router.post(
    "/:id/cancel",
    requireDoctorCsrf,
    cancelAppointmentController
);

export default router;
