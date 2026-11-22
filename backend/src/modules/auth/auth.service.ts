
import argon2 from "argon2";

import { AppDataSource } from "../../config/data_source.js";
import { Doctor } from "../../entities/Doctor.js";

export async function verifyDoctorCredentials(
    email: string,
    password: string
): Promise<Doctor | null> {

    const doctorRepository = AppDataSource.getRepository(Doctor);

    const doctor = await doctorRepository.findOneBy({
        email: email.trim()
    });

    if (!doctor) {
        return null;
    }

    const passwordIsValid = await argon2.verify(
        doctor.passwordHash,
        password
    );

    if (!passwordIsValid) {
        return null;
    }

    return doctor;
}
