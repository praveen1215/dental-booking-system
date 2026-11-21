import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRemainingEntities1795261630544 implements MigrationInterface {
    name = 'CreateRemainingEntities1795261630544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctors" ("doctorId" BIGSERIAL NOT NULL, "doctorName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_62069f52ebba471c91de5d59d61" UNIQUE ("email"), CONSTRAINT "PK_059971ad86db9f4acff1ef31ac2" PRIMARY KEY ("doctorId"))`);
        await queryRunner.query(`CREATE TABLE "dental_services" ("serviceId" BIGSERIAL NOT NULL, "serviceName" character varying(100) NOT NULL, "durationMinutes" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ecc6f0acc625cb911c2a309d1c3" UNIQUE ("serviceName"), CONSTRAINT "CHK_de5a084cd5f19e0509293f4354" CHECK ("durationMinutes" > 0), CONSTRAINT "PK_42eade85b22dd6df7efc6d50384" PRIMARY KEY ("serviceId"))`);
        await queryRunner.query(`CREATE TABLE "appointments" ("appointmentId" BIGSERIAL NOT NULL, "bookingReference" character varying(30) NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'confirmed', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "patientId" bigint NOT NULL, "doctorId" bigint NOT NULL, "serviceId" bigint NOT NULL, CONSTRAINT "UQ_56e89879d82ddead1fa9323ee2b" UNIQUE ("bookingReference"), CONSTRAINT "CHK_2bae7ee5d067fe8c4c19e1cf27" CHECK ("status" IN ('confirmed', 'cancelled')), CONSTRAINT "CHK_df337c4fb231a94af684854c9a" CHECK ("endTime" > "startTime"), CONSTRAINT "PK_16345caffd6ea5e1a799639b012" PRIMARY KEY ("appointmentId"))`);
        await queryRunner.query(`CREATE TABLE "appointment_cancellations" ("cancellationId" BIGSERIAL NOT NULL, "reason" text NOT NULL, "cancelledAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "appointmentId" bigint NOT NULL, "cancelledByDoctorId" bigint NOT NULL, CONSTRAINT "REL_301a0d30740befe8d9b07ef0c5" UNIQUE ("appointmentId"), CONSTRAINT "CHK_14f76a4a17291375aec0a43bdf" CHECK (length(trim("reason")) > 0), CONSTRAINT "PK_5d41a8a71b8041e77ab84c4a82d" PRIMARY KEY ("cancellationId"))`);
        await queryRunner.query(`CREATE TABLE "doctor_schedules" ("scheduleId" BIGSERIAL NOT NULL, "dayOfWeek" smallint NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "doctorId" bigint NOT NULL, CONSTRAINT "CHK_a81e2cdc28ef7d47421994403e" CHECK ("endTime" > "startTime"), CONSTRAINT "CHK_83b35fb3cf1dfe3f70fdeba75c" CHECK ("dayOfWeek" BETWEEN 0 AND 6), CONSTRAINT "PK_fe2e1cc32906f26ea40b0ab8bca" PRIMARY KEY ("scheduleId"))`);
        await queryRunner.query(`CREATE TABLE "doctor_schedule_overrides" ("overrideId" BIGSERIAL NOT NULL, "overrideDate" date NOT NULL, "startTime" TIME, "endTime" TIME, "isClosed" boolean NOT NULL DEFAULT false, "doctorId" bigint NOT NULL, CONSTRAINT "UQ_0064f0e2eac8367a023a5d10757" UNIQUE ("doctorId", "overrideDate"), CONSTRAINT "CHK_1572b901eb8020ff908c71190e" CHECK ((
    ("isClosed" = true AND "startTime" IS NULL AND "endTime" IS NULL)
    OR
    ("isClosed" = false AND "startTime" IS NOT NULL
     AND "endTime" IS NOT NULL AND "endTime" > "startTime")
)), CONSTRAINT "PK_df996ffdf988269e7535d1799b1" PRIMARY KEY ("overrideId"))`);
        await queryRunner.query(`CREATE TABLE "doctor_unavailability" ("unavailabilityId" BIGSERIAL NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "reason" character varying(255), "doctorId" bigint NOT NULL, CONSTRAINT "CHK_fa1079a80fbf062652b36cbef7" CHECK ("endTime" > "startTime"), CONSTRAINT "PK_fa0647ea31dcaa8bf47f7ae7ee2" PRIMARY KEY ("unavailabilityId"))`);
        await queryRunner.query(`CREATE TABLE "email_notifications" ("notificationId" BIGSERIAL NOT NULL, "recipientEmail" character varying(255) NOT NULL, "notificationType" character varying(20) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "attemptCount" integer NOT NULL DEFAULT '0', "errorMessage" text, "sentAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "appointmentId" bigint NOT NULL, CONSTRAINT "CHK_d40a42718aec44a453d3a3c276" CHECK ("attemptCount" >= 0), CONSTRAINT "CHK_d4e26817b0746739bf82d860fc" CHECK ("status" IN ('pending', 'sent', 'failed')), CONSTRAINT "CHK_77dd622f26ba23944aa10707c2" CHECK ("notificationType" IN ('confirmation', 'cancellation')), CONSTRAINT "PK_3295d8d00b6ecaf262ea3216f1b" PRIMARY KEY ("notificationId"))`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES "patients"("patientId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_0c1af27b469cb8dca420c160d65" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_f77953c373efb8ab146d98e90c3" FOREIGN KEY ("serviceId") REFERENCES "dental_services"("serviceId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_cancellations" ADD CONSTRAINT "FK_301a0d30740befe8d9b07ef0c5e" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("appointmentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_cancellations" ADD CONSTRAINT "FK_e3ba225526e8c78c6bc129da7cc" FOREIGN KEY ("cancelledByDoctorId") REFERENCES "doctors"("doctorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_schedules" ADD CONSTRAINT "FK_238680c7cf4a83dc020a7c824c5" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_schedule_overrides" ADD CONSTRAINT "FK_53ab048265a667f4eb794f12747" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_unavailability" ADD CONSTRAINT "FK_f1db8c9bacf881fcc7624eec07b" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_b357b6965f51c74c4ca01a30259" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("appointmentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_b357b6965f51c74c4ca01a30259"`);
        await queryRunner.query(`ALTER TABLE "doctor_unavailability" DROP CONSTRAINT "FK_f1db8c9bacf881fcc7624eec07b"`);
        await queryRunner.query(`ALTER TABLE "doctor_schedule_overrides" DROP CONSTRAINT "FK_53ab048265a667f4eb794f12747"`);
        await queryRunner.query(`ALTER TABLE "doctor_schedules" DROP CONSTRAINT "FK_238680c7cf4a83dc020a7c824c5"`);
        await queryRunner.query(`ALTER TABLE "appointment_cancellations" DROP CONSTRAINT "FK_e3ba225526e8c78c6bc129da7cc"`);
        await queryRunner.query(`ALTER TABLE "appointment_cancellations" DROP CONSTRAINT "FK_301a0d30740befe8d9b07ef0c5e"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_f77953c373efb8ab146d98e90c3"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_0c1af27b469cb8dca420c160d65"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d"`);
        await queryRunner.query(`DROP TABLE "email_notifications"`);
        await queryRunner.query(`DROP TABLE "doctor_unavailability"`);
        await queryRunner.query(`DROP TABLE "doctor_schedule_overrides"`);
        await queryRunner.query(`DROP TABLE "doctor_schedules"`);
        await queryRunner.query(`DROP TABLE "appointment_cancellations"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "dental_services"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
    }

}
