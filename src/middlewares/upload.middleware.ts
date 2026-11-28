import type { NextFunction, Request, Response } from "express";
import multer from "../libs/multer";

export function uploadProductImages(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"] ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  if (!contentType.includes("boundary=")) {
    return res.status(400).json({
      message:
        'Content-Type inválido. Usa FormData y no establezcas "Content-Type" manualmente; el cliente debe incluir el boundary automáticamente.',
    });
  }

  // Acepta "images" (varios) o "image" (uno) para no perder la subida si el front usa otro nombre
  multer.fields([
    { name: "images", maxCount: 20 },
    { name: "image", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);

    const files = req.files as { images?: Express.Multer.File[]; image?: Express.Multer.File[] } | undefined;
    const merged = [...(files?.images ?? []), ...(files?.image ?? [])];
    (req as Request & { files: Express.Multer.File[] }).files = merged;
    next();
  });
}

export function uploadBrandImage(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"] ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return next();
  }
  
  if (!contentType.includes("boundary=")) {
    return res.status(400).json({
      message:
        'Content-Type inválido. Usa FormData y no establezcas "Content-Type" manualmente; el cliente debe incluir el boundary automáticamente.',
    });
  }
  
  multer.single("logo")(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}

export function uploadCategoryImage(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"] ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  if (!contentType.includes("boundary=")) {
    return res.status(400).json({
      message:
        'Content-Type inválido. Usa FormData y no establezcas "Content-Type" manualmente; el cliente debe incluir el boundary automáticamente.',
    });
  }

  multer.single("image")(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}

export function uploadNewsLetterFiles(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"] ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  if (!contentType.includes("boundary=")) {
    return res.status(400).json({
      message:
        'Content-Type inválido. Usa FormData y no establezcas "Content-Type" manualmente; el cliente debe incluir el boundary automáticamente.',
    });
  }

  multer.fields([
    { name: "path", maxCount: 1 },
    { name: "pathImage", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}
