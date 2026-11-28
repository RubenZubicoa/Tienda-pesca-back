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

  // any() deja req.files como File[]; fields() lo convierte en objeto y rompe el controlador
  multer.any()(req, res, (err) => {
    if (err) return next(err);

    const all = (Array.isArray(req.files) ? req.files : []) as Express.Multer.File[];
    req.files = all.filter(
      (file) => file.fieldname === "images" || file.fieldname === "image"
    );
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
