
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Check,
    
} from "typeorm";
import type { Relation } from "typeorm";
import { Doctor } from "./Doctor.js";

@Entity("doctor_unavailability")
@Check(`"endTime" > "startTime"`)
export class DoctorUnavailability {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    unavailabilityId!: string;

    @ManyToOne(() => Doctor, { nullable: false })
    @JoinColumn({ name: "doctorId" })
    doctor!: Relation<Doctor>;

    @Column({ type: "timestamptz" })
    startTime!: Date;

    @Column({ type: "timestamptz" })
    endTime!: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    reason!: string | null;
}
