import type { NextFunction, Request, Response } from "express";
import {
  createNewsLetter,
  deleteNewsLetter,
  getNewsLetterById,
  listNewsLetters,
  updateNewsLetter,
} from "../Models/newsLetter.model";
import { uploadToCloudinary } from "../libs/cloudinary";

type NewsLetterFiles = {
  path?: Express.Multer.File[];
  pathImage?: Express.Multer.File[];
};

function getNewsLetterFiles(req: Request): NewsLetterFiles {
  return (req.files as NewsLetterFiles | undefined) ?? {};
}

export async function createNewsLetterController(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, publishedAt } = req.body ?? {};
    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "El campo 'title' es obligatorio" });
    }

    const files = getNewsLetterFiles(req);
    const document = files.path?.[0];
    if (!document) {
      return res.status(400).json({ message: "El documento 'path' es obligatorio" });
    }

    const documentUrl = await uploadToCloudinary(document, "auto");
    if (!documentUrl) {
      return res.status(400).json({ message: "Error al subir el documento" });
    }

    let imageUrl: string | undefined;
    const image = files.pathImage?.[0];
    if (image) {
      imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) return res.status(400).json({ message: "Error al subir la imagen" });
    }

    const created = await createNewsLetter({
      title,
      path: documentUrl,
      pathImage: imageUrl,
      publishedAt: publishedAt != null ? Number(publishedAt) : undefined,
    });
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listNewsLettersController(_req: Request, res: Response, next: NextFunction) {
  try {
    const newsLetters = await listNewsLetters();
    return res.json(newsLetters);
  } catch (err) {
    next(err as Error);
  }
}

export async function getNewsLetterByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const newsLetter = await getNewsLetterById(id);
    if (!newsLetter) return res.status(404).json({ message: "NewsLetter no encontrada" });
    return res.json(newsLetter);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateNewsLetterController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const patch: Record<string, unknown> = { ...(req.body ?? {}) };

    if (patch.publishedAt != null) {
      patch.publishedAt = Number(patch.publishedAt);
    }

    // path y pathImage vienen como archivos; no guardar strings del body
    delete patch.path;
    delete patch.pathImage;

    const files = getNewsLetterFiles(req);

    const document = files.path?.[0];
    if (document) {
      const documentUrl = await uploadToCloudinary(document, "auto");
      if (!documentUrl) return res.status(400).json({ message: "Error al subir el documento" });
      patch.path = documentUrl;
    }

    const image = files.pathImage?.[0];
    if (image) {
      const imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) return res.status(400).json({ message: "Error al subir la imagen" });
      patch.pathImage = imageUrl;
    }

    const updated = await updateNewsLetter(id, patch);
    if (!updated) return res.status(404).json({ message: "NewsLetter no encontrada" });
    return res.json(updated);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteNewsLetterController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const existing = await getNewsLetterById(id);
    if (!existing) return res.status(404).json({ message: "NewsLetter no encontrada" });
    await deleteNewsLetter(id);
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}
