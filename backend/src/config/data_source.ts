import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";


import { Patient } from "../entities/Patient.js";
import { Doctor } from "../entities/Doctor.js";
import { DentalService } from "../entities/DentalService.js";
import { Appointment } from "../entities/Appointment.js";
import { AppointmentCancellation } from "../entities/AppointmentCancellation.js";
import { DoctorSchedule } from "../entities/DoctorSchedule.js";
import { DoctorScheduleOverride } from "../entities/DoctorScheduleOverride.js";
import { DoctorUnavailability } from "../entities/DoctorUnavailability.js";
import { EmailNotification } from "../entities/EmailNotification.js";

const dbPassword = process.env.DB_PASSWORD;

if (!dbPassword) {
    throw new Error("DB_PASSWORD is missing from the .env file");
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? "postgres",
    password: dbPassword,
    database: process.env.DB_NAME ?? "dental_booking_db",

    synchronize: false,
    logging: false,

    entities: [Patient, Doctor, DentalService, Appointment, AppointmentCancellation, DoctorSchedule, DoctorScheduleOverride, DoctorUnavailability, EmailNotification],
    migrations: ["src/migrations/*.ts"]
});