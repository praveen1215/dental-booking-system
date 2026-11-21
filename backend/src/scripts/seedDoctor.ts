
import "dotenv/config";
import argon2 from "argon2";

import { AppDataSource } from "../config/data_source.js";
import { Doctor } from "../entities/Doctor.js";

async function seedDoctor() {
    try {
        // 1. Read doctor details from .env
        const doctorName = process.env.SEED_DOCTOR_NAME;
        const email = process.env.SEED_DOCTOR_EMAIL;
        const password = process.env.SEED_DOCTOR_PASSWORD;

        // 2. Validate the configuration
        if (!doctorName || !email || !password) {
            throw new Error("Doctor setup credentials are missing.");
        }

        // 3. Connect to PostgreSQL
        await AppDataSource.initialize();

        // 4. Get the Doctor repository
        const doctorRepository = AppDataSource.getRepository(Doctor);

        // 5. Check whether a doctor already exists
        const existingDoctor = await doctorRepository.findOne({
            where: {}
        });

        if (existingDoctor) {
            console.log("A doctor account already exists. Skipping setup.");
            return;
        }

        // 6. Hash the password securely
        const hashedPassword = await argon2.hash(password);

        // 7. Create a new Doctor entity
        const doctor = doctorRepository.create({
            doctorName: doctorName,
            email: email,
            passwordHash: hashedPassword
        });

        // 8. Save the doctor in PostgreSQL
        const savedDoctor = await doctorRepository.save(doctor);

        console.log("Doctor account created successfully!");
        console.log("Doctor ID:", savedDoctor.doctorId);
        console.log("Doctor Name:", savedDoctor.doctorName);
        console.log("Doctor Email:", savedDoctor.email);

    } catch (error) {
        console.error("Doctor setup failed:", error);
        process.exitCode = 1;

    } finally {
        // 9. Close the database connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

seedDoctor();
