
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Check
    
} from "typeorm";
import type { Relation } from "typeorm";
import { Appointment } from "./Appointment.js";
import { Doctor } from "./Doctor.js";

@Entity("appointment_cancellations")
@Check(`length(trim("reason")) > 0`)
export class AppointmentCancellation {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    cancellationId!: string;

    @OneToOne(() => Appointment, { nullable: false })
    @JoinColumn({ name: "appointmentId" })
    appointment!: Relation<Appointment>;

    @ManyToOne(() => Doctor, { nullable: false })
    @JoinColumn({ name: "cancelledByDoctorId" })
    cancelledBy!: Relation<Doctor>;

    @Column({ type: "text" })
    reason!: string;

    @CreateDateColumn({ type: "timestamptz" })
    cancelledAt!: Date;
}
