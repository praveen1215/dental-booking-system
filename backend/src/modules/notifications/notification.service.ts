
import type { EntityManager } from "typeorm";

import { EmailNotification } from "../../entities/EmailNotification.js";
import type { Appointment } from "../../entities/Appointment.js";

export type NotificationType = "confirmation" | "cancellation";

export async function queueEmailNotification(
    manager: EntityManager,
    appointment: Appointment,
    recipientEmail: string,
    notificationType: NotificationType
) {
    const repository = manager.getRepository(EmailNotification);

    const notification = repository.create({
        appointment,
        recipientEmail,
        notificationType,
        status: "pending",
        attemptCount: 0
    });

    return repository.save(notification);
}
