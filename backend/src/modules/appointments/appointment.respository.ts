import { AppDataSource } from "../../config/data_source.js";
import { Appointment } from "../../entities/Appointment.js";

export function getAppointmentRespository() {
    return AppDataSource.getRepository(Appointment);
}