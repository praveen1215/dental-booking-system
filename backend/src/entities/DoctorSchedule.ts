
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Check
    
} from "typeorm";
import type { Relation } from "typeorm";
import { Doctor } from "./Doctor.js";

@Entity("doctor_schedules")
@Check(`"dayOfWeek" BETWEEN 0 AND 6`)
@Check(`"endTime" > "startTime"`)
export class DoctorSchedule {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    scheduleId!: string;

    @ManyToOne(() => Doctor, { nullable: false })
    @JoinColumn({ name: "doctorId" })
    doctor!: Relation<Doctor>;

    @Column({ type: "smallint" })
    dayOfWeek!: number;

    @Column({ type: "time" })
    startTime!: string;

    @Column({ type: "time" })
    endTime!: string;
}
