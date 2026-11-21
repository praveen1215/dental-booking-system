import app from "./app.js";
import { AppDataSource } from "./config/data_source.js";
async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("Database connection established successfully.");
        const PORT = 5000;
        app.listen(PORT, () => {
            console.log(`Server Starts in port ${PORT}`);
        });
    } catch (error) {
        console.error("failed to start server:", error);
    }
}
startServer();