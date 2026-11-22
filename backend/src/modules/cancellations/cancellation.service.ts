
import { AppDataSource } from "../../config/data_source.js";
import { Appointment } from "../../entities/Appointment.js";
import { AppointmentCancellation } from "../../entities/AppointmentCancellation.js";
import { Doctor } from "../../entities/Doctor.js";

export class CancellationError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "CancellationError";
    }
}

export async function cancelAppointment(
    appointmentId: string,
    doctorId: string,
    reason: string
) {
    return AppDataSource.transaction(async (manager) => {
        const appointmentRepository =
            manager.getRepository(Appointment);

        const cancellationRepository =
            manager.getRepository(AppointmentCancellation);

        // Lock the appointment so simultaneous cancellation
        // requests cannot both succeed.
        const appointment = await appointmentRepository
            .createQueryBuilder("appointment")
            .innerJoin(
                "appointment.doctor",
                "doctor"
            )
            .where(
                "appointment.appointmentId = :appointmentId",
                { appointmentId }
            )
            .andWhere(
                "doctor.doctorId = :doctorId",
                { doctorId }
            )
            .setLock(
                "pessimistic_write",
                undefined,
                ["appointment"]
            )
            .getOne();

        if (!appointment) {
            throw new CancellationError(
                404,
                "Appointment not found."
            );
        }

        if (appointment.status === "cancelled") {
            throw new CancellationError(
                409,
                "This appointment has already been cancelled."
            );
        }

        if (appointment.status !== "confirmed") {
            throw new CancellationError(
                409,
                "Only confirmed appointments can be cancelled."
            );
        }

        const doctor = await manager
            .getRepository(Doctor)
            .findOneBy({ doctorId });

        if (!doctor) {
            throw new CancellationError(
                401,
                "Doctor account not found."
            );
        }

        appointment.status = "cancelled";

        await appointmentRepository.save(appointment);

        const cancellation = cancellationRepository.create({
            appointment,
            cancelledBy: doctor,
            reason: reason.trim(),
            cancelledAt: new Date()
        });

        const savedCancellation =
            await cancellationRepository.save(cancellation);

        return {
            appointmentId: appointment.appointmentId,
            bookingReference: appointment.bookingReference,
            status: appointment.status,
            cancellation: {
                cancellationId: savedCancellation.cancellationId,
                reason: savedCancellation.reason,
                cancelledAt: savedCancellation.cancelledAt,
                cancelledByDoctorId: doctor.doctorId
            }
        };
    });
}
