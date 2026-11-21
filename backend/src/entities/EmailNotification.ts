
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Check,
    
} from "typeorm";

import type { Relation } from "typeorm";
import { Appointment } from "./Appointment.js";

@Entity("email_notifications")
@Check(`"notificationType" IN ('confirmation', 'cancellation')`)
@Check(`"status" IN ('pending', 'sent', 'failed')`)
@Check(`"attemptCount" >= 0`)
export class EmailNotification {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    notificationId!: string;

    @ManyToOne(() => Appointment, { nullable: false })
    @JoinColumn({ name: "appointmentId" })
    appointment!: Relation<Appointment>;

    @Column({ type: "varchar", length: 255 })
    recipientEmail!: string;

    @Column({ type: "varchar", length: 20 })
    notificationType!: "confirmation" | "cancellation";

    @Column({
        type: "varchar",
        length: 20,
        default: "pending"
    })
    status!: "pending" | "sent" | "failed";

    @Column({ type: "int", default: 0 })
    attemptCount!: number;

    @Column({ type: "text", nullable: true })
    errorMessage!: string | null;

    @Column({ type: "timestamptz", nullable: true })
    sentAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}
