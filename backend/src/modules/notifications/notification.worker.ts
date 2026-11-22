
import { AppDataSource } from "../../config/data_source.js";
import { sendEmail, verifyEmailConnection } from "../../config/mail.js";

import { EmailNotification } from "../../entities/EmailNotification.js";
import { AppointmentCancellation } from "../../entities/AppointmentCancellation.js";

const MAX_ATTEMPTS = 3;
let isProcessing = false;

function formatDate(date: Date): string {
    return new Date(date).toLocaleString("en-GB", {
        timeZone: process.env.CLINIC_TIMEZONE ?? "Asia/Colombo",
        dateStyle: "full",
        timeStyle: "short"
    });
}

async function createEmailContent(
    notification: EmailNotification,
    manager: import("typeorm").EntityManager
) {
    const appointment = notification.appointment;
    const clinicName = process.env.CLINIC_NAME ?? "Dental Clinic";

    if (notification.notificationType === "confirmation") {
        // Do not send an outdated confirmation.
        if (appointment.status !== "confirmed") {
            return null;
        }

        return {
            subject: `${clinicName} - Appointment Confirmation`,
            text: [
                `Dear ${appointment.patient.patientName},`,
                "",
                "Your dental appointment has been confirmed.",
                "",
                `Booking Reference: ${appointment.bookingReference}`,
                `Date and Time: ${formatDate(appointment.startTime)}`,
                "",
                "Thank you for booking with us.",
                clinicName
            ].join("\n")
        };
    }

    if (notification.notificationType === "cancellation") {
        const cancellation = await manager
            .getRepository(AppointmentCancellation)
            .findOne({
                where: {
                    appointment: {
                        appointmentId: appointment.appointmentId
                    }
                }
            });

        if (!cancellation) {
            throw new Error("Cancellation reason not found.");
        }

        return {
            subject: `${clinicName} - Appointment Cancellation`,
            text: [
                `Dear ${appointment.patient.patientName},`,
                "",
                "Your dental appointment has been cancelled.",
                "",
                `Booking Reference: ${appointment.bookingReference}`,
                `Original Date and Time: ${formatDate(appointment.startTime)}`,
                `Reason: ${cancellation.reason}`,
                "",
                "Please contact the clinic for assistance.",
                clinicName
            ].join("\n")
        };
    }

    throw new Error("Unknown notification type.");
}

async function processOneEmail(): Promise<boolean> {
    let processed = false;

    await AppDataSource.transaction(async (manager) => {
        const repository = manager.getRepository(EmailNotification);

        const notification = await repository
            .createQueryBuilder("notification")
            .innerJoinAndSelect(
                "notification.appointment",
                "appointment"
            )
            .innerJoinAndSelect(
                "appointment.patient",
                "patient"
            )
            .where("notification.status IN (:...statuses)", {
                statuses: ["pending", "failed"]
            })
            .andWhere("notification.attemptCount < :max", {
                max: MAX_ATTEMPTS
            })
            .orderBy("notification.createdAt", "ASC")
            .setLock(
                "pessimistic_write",
                undefined,
                ["notification"]
            )
            .setOnLocked("skip_locked")
            .getOne();

        if (!notification) {
            return;
        }

        processed = true;

        try {
            const content = await createEmailContent(
                notification,
                manager
            );

            if (!content) {
                notification.status = "failed";
                notification.attemptCount = MAX_ATTEMPTS;
                notification.errorMessage =
                    "Appointment no longer requires this notification.";

                await repository.save(notification);
                return;
            }

            // SMTP delivery is performed only after the
            // original appointment transaction has committed.
            await sendEmail(
                notification.recipientEmail,
                content.subject,
                content.text
            );

            notification.status = "sent";
            notification.sentAt = new Date();
            notification.errorMessage = null;
            notification.attemptCount += 1;

            await repository.save(notification);

            console.log(
                `Email sent for notification ${notification.notificationId}`
            );

        } catch (error) {
            notification.status = "failed";
            notification.attemptCount += 1;
            notification.errorMessage =
                error instanceof Error
                    ? error.message.slice(0, 1000)
                    : "Unknown delivery error";

            await repository.save(notification);

            console.error(
                `Email attempt failed for notification ${notification.notificationId}`
            );
        }
    });

    return processed;
}

export async function processEmailQueue() {
    if (isProcessing || !AppDataSource.isInitialized) {
        return;
    }

    isProcessing = true;

    try {
        for (let i = 0; i < 10; i++) {
            const processed = await processOneEmail();

            if (!processed) {
                break;
            }
        }
    } catch (error) {
        console.error("Email worker error:", error);
    } finally {
        isProcessing = false;
    }
}

export async function startEmailWorker() {
    if (process.env.EMAIL_ENABLED !== "true") {
        console.log("Email worker disabled.");
        return;
    }

    await verifyEmailConnection();

    const interval = Number(
        process.env.EMAIL_POLL_INTERVAL_MS ?? 15000
    );

    if (!Number.isFinite(interval) || interval < 1000) {
        throw new Error("Invalid EMAIL_POLL_INTERVAL_MS.");
    }

    // Check queued email records immediately.
    void processEmailQueue();

    const timer = setInterval(() => {
        void processEmailQueue();
    }, interval);

    timer.unref();

    console.log("Email notification worker started.");
}
