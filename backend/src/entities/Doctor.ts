
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from "typeorm";

@Entity("doctors")
export class Doctor {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    doctorId!: string;

    @Column({ type: "varchar", length: 100 })
    doctorName!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    passwordHash!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}
