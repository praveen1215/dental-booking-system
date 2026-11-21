import type {Request, Response} from "express";
import {createAppointment} from "./appointment.service.js";

export function createAppointmentController(req: Request,res:Response){
    const patientDetails =req.body;
    const appointemnt = createAppointment(patientDetails);
    return res.status(201).json(appointemnt);
}