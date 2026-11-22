
import "dotenv/config";

import app from "./app.js";
import { AppDataSource } from "./config/data_source.js";
import { startEmailWorker } from "./modules/notifications/notification.worker.js";

async function startServer() {
    try {
        await AppDataSource.initialize();

        console.log("Database connection established successfully.");

        const PORT = 5000;

        app.listen(PORT, () => {
            console.log(`Server starts on port ${PORT}`);

            // Start automatic email notifications
            void startEmailWorker().catch((error) => {
                console.error("Email worker startup failed:", error);
            });
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exitCode = 1;
    }
}

void startServer();
