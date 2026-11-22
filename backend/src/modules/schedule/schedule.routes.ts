
import { Router } from "express";

import {
    requireDoctor,
    requireDoctorCsrf
} from "../../middleware/requireDoctor.js";

import {
    getScheduleController,
    setWeeklyScheduleController,
    deleteWeeklyScheduleController,
    setOverrideController,
    deleteOverrideController,
    createUnavailabilityController,
    deleteUnavailabilityController
} from "./schedule.controller.js";

const router = Router();

// All schedule endpoints require doctor login.
router.use(requireDoctor);

// View complete schedule
router.get("/", getScheduleController);

// Set regular weekly working hours
router.put(
    "/weekly/:dayOfWeek",
    requireDoctorCsrf,
    setWeeklyScheduleController
);

// Remove a weekly schedule
router.delete(
    "/weekly/:dayOfWeek",
    requireDoctorCsrf,
    deleteWeeklyScheduleController
);

// Set special-date working hours or closure
router.put(
    "/overrides/:date",
    requireDoctorCsrf,
    setOverrideController
);

// Remove a special-date override
router.delete(
    "/overrides/:date",
    requireDoctorCsrf,
    deleteOverrideController
);

// Create an unavailable period
router.post(
    "/unavailability",
    requireDoctorCsrf,
    createUnavailabilityController
);

// Remove an unavailable period
router.delete(
    "/unavailability/:id",
    requireDoctorCsrf,
    deleteUnavailabilityController
);

export default router;
