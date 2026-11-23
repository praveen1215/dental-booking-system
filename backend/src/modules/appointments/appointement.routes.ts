
import { Router } from "express";
import {
    createAppointmentController
} from "./appointment.controller.js";

const router = Router();

router.post("/", createAppointmentController);

export default router;
