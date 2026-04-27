import { NextFunction, Request, Response } from "express";
import { logger } from "../libs/logger";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err.message, { error: err.message, stack: err.stack, timestamp: new Date().toISOString() });
    res.status(500).json({ message: "Error interno del servidor", error: err.message });
}