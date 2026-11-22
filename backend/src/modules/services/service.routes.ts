import { Router } from "express";

import {getAllDentalServicesController}
    
from "./service.controller.js";

const router = Router();

router.get("/", getAllDentalServicesController);

export default router;
