
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Check
} from "typeorm";

@Entity("dental_services")
@Check(`"durationMinutes" > 0`)
export class DentalService {

    @PrimaryGeneratedColumn("increment", { type: "bigint" })
    serviceId!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    serviceName!: string;

    @Column({ type: "int" })
    durationMinutes!: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}
