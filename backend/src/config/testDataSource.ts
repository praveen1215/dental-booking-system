import { AppDataSource } from "./data_source.js";

async function testConnection() {
    try {
        await AppDataSource.initialize();

        console.log("TypeORM connected to PostgreSQL successfully!");

        const result = await AppDataSource.query("SELECT NOW()");
        console.log(result);

    } catch (error) {
        console.error("TypeORM connection failed:", error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

testConnection();