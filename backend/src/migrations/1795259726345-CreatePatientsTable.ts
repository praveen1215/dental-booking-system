import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientsTable1795259726345 implements MigrationInterface {
    name = 'CreatePatientsTable1795259726345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patients" ("patientId" BIGSERIAL NOT NULL, "patientName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a4541d8ee871783657d9b139463" PRIMARY KEY ("patientId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "patients"`);
    }

}
