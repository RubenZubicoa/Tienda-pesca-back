import type { NextFunction, Request, Response } from "express";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  listBrands,
  updateBrand,
} from "../Models/brand.model";

export async function createBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description } = req.body ?? {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }

    const created = await createBrand({ name, description });
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listBrandsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await listBrands();
    return res.json(brands);
  } catch (err) {
    next(err as Error);
  }
}

export async function getBrandByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await getBrandById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand no encontrada" });
    return res.json(brand);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    const patch = req.body ?? {};
    const updated = await updateBrand(req.params.id, patch);
    if (!updated) return res.status(404).json({ message: "Brand no encontrada" });
    return res.json(updated);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteBrandController(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await getBrandById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Brand no encontrada" });
    await deleteBrand(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}

