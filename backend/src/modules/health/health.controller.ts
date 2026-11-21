import type {Request, Response} from "express";
import {getHealthStatus} from "./health.service.js";

export function getHealth(req: Request, res: Response) {
    res.json(getHealthStatus());
}