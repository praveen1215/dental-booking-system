
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
} from "typeorm";

@Entity("patients")
export class Patient {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    patientId!: string;

    @Column({ type: "varchar", length: 100 })
    patientName!: string;

    @Column({ type: "varchar", length: 255 })
    email!: string;

    @Column({ type: "varchar", length: 20 })
    phone!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}
