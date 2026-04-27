import type { NextFunction, Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "../Models/category.model";

export async function createCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, parentId } = req.body ?? {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }

    const created = await createCategory({ name, description, parentId });
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listCategoriesController(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await listCategories();
    return res.json(categories);
  } catch (err) {
    next(err as Error);
  }
}

export async function getCategoryByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const category = await getCategoryById(id);
    if (!category) return res.status(404).json({ message: "Category no encontrada" });
    return res.json(category);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const patch = req.body ?? {};
    const updated = await updateCategory(id, patch);
    if (!updated) return res.status(404).json({ message: "Category no encontrada" });
    return res.json(updated);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const existing = await getCategoryById(id);
    if (!existing) return res.status(404).json({ message: "Category no encontrada" });
    await deleteCategory(id);
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}

