import express from "express";
import healthRouter from "./modules/health/health.routes.js";
import appointmentrouter from "./modules/appointments/appointement.routes.js";
//creates an express application instance
const app = express();

app.use(express.json());
app.use("/api", healthRouter);
app.use("/api/appointments", appointmentrouter);







export default app;