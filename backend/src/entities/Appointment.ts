
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
import { Patient } from "./Patient.js";
import { Doctor } from "./Doctor.js";
import { DentalService } from "./DentalService.js";

@Entity("appointments")
@Check(`"endTime" > "startTime"`)
@Check(`"status" IN ('confirmed', 'cancelled')`)
export class Appointment {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    appointmentId!: string;

    @Column({ type: "varchar", length: 30, unique: true })
    bookingReference!: string;

    @ManyToOne(() => Patient, { nullable: false })
    @JoinColumn({ name: "patientId" })
    patient!: Relation<Patient>;

    @ManyToOne(() => Doctor, { nullable: false })
    @JoinColumn({ name: "doctorId" })
    doctor!: Relation<Doctor>;

    @ManyToOne(() => DentalService, { nullable: false })
    @JoinColumn({ name: "serviceId" })
    dentalService!: Relation<DentalService>;

    @Column({ type: "timestamptz" })
    startTime!: Date;

    @Column({ type: "timestamptz" })
    endTime!: Date;

    @Column({
        type: "varchar",
        length: 20,
        default: "confirmed"
    })
    status!: "confirmed" | "cancelled";

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}
