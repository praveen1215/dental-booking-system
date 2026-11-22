
import { Router } from "express";

import {
    getAllDentalServicesController,
    createDentalServiceController,
    updateDentalServiceController
} from "../services/service.controller.js";

import {
    requireDoctor,
    requireDoctorCsrf
} from "../../middleware/requireDoctor.js";

const router = Router();

// All routes below require doctor login
router.use(requireDoctor);

// Doctor views all services
router.get(
    "/",
    getAllDentalServicesController
);

// Doctor adds a new service
router.post(
    "/",
    requireDoctorCsrf,
    createDentalServiceController
);

// Doctor updates a service duration
router.patch(
    "/:id",
    requireDoctorCsrf,
    updateDentalServiceController
);

export default router;
