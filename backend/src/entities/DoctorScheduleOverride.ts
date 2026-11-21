
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
    Check,
    
} from "typeorm";

import type { Relation } from "typeorm";
import { Doctor } from "./Doctor.js";

@Entity("doctor_schedule_overrides")
@Unique(["doctor", "overrideDate"])
@Check(`(
    ("isClosed" = true AND "startTime" IS NULL AND "endTime" IS NULL)
    OR
    ("isClosed" = false AND "startTime" IS NOT NULL
     AND "endTime" IS NOT NULL AND "endTime" > "startTime")
)`)
export class DoctorScheduleOverride {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    overrideId!: string;

    @ManyToOne(() => Doctor, { nullable: false })
    @JoinColumn({ name: "doctorId" })
    doctor!: Relation<Doctor>;

    @Column({ type: "date" })
    overrideDate!: string;

    @Column({ type: "time", nullable: true })
    startTime!: string | null;

    @Column({ type: "time", nullable: true })
    endTime!: string | null;

    @Column({ type: "boolean", default: false })
    isClosed!: boolean;
}
