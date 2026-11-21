import type {Appointment, CreateAppointmentDTO} from "./appointment.types.js";
import { randomUUID } from "node:crypto";
export function createAppointment(patientDetails: CreateAppointmentDTO): Appointment {

const appointment: Appointment = {
    ...patientDetails,
    id: randomUUID(),
    status: "confirmed"
};
return appointment;
}