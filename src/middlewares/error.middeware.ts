import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { logger } from "../libs/logger";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err.message, { error: err.message, stack: err.stack, timestamp: new Date().toISOString() });

    if (err.message === "request entity too large" || (err as { type?: string }).type === "entity.too.large") {
        return res.status(413).json({ message: "El archivo o la petición supera el tamaño máximo permitido (10 MB)" });
    }

    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ message: "Alguna imagen supera el tamaño máximo permitido (10 MB)" });
        }
        return res.status(400).json({ message: err.message });
    }

    if (err.message === "Unexpected end of form") {
        return res.status(400).json({
            message:
                'Error al leer el formulario. Envía los datos con FormData (campo "images" para las fotos) y no fijes Content-Type manualmente.',
        });
    }

    res.status(500).json({ message: "Error interno del servidor", error: err.message });
}