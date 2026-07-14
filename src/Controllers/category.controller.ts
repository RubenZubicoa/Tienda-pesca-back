import type { NextFunction, Request, Response } from "express";
import {
  CategoryValidationError,
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "../Models/category.model";

export async function createCategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const { label, description, children } = req.body ?? {};
    if (!label || typeof label !== "string" || !label.trim()) {
      return res.status(400).json({ message: "El campo 'label' es obligatorio" });
    }

    const created = await createCategory({ label, description, children });
    return res.status(201).json(created);
  } catch (err) {
    if (err instanceof CategoryValidationError) {
      return res.status(400).json({ message: err.message });
    }
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
    const updated = await updateCategoryFromBody(id, req.body);
    if (!updated) return res.status(404).json({ message: "Category no encontrada" });
    return res.json(updated);
  } catch (err) {
    if (err instanceof CategoryValidationError) {
      return res.status(400).json({ message: err.message });
    }
    next(err as Error);
  }
}

export async function updateSubcategoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const parentId = String(req.params.categoryId);
    const subcategoryId = String(req.params.subcategoryId);
    const parent = await getCategoryById(parentId);

    if (!parent) {
      return res.status(404).json({ message: "Categoría padre no encontrada" });
    }

    const subcategoryExists = parent.children?.some(
      (child) => child._id?.toString() === subcategoryId
    );
    if (!subcategoryExists) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    const updated = await updateCategoryFromBody(subcategoryId, req.body);
    if (!updated) return res.status(404).json({ message: "Category no encontrada" });
    return res.json(updated);
  } catch (err) {
    if (err instanceof CategoryValidationError) {
      return res.status(400).json({ message: err.message });
    }
    next(err as Error);
  }
}

async function updateCategoryFromBody(id: string, body: unknown) {
  const { label, description, children } = (body as Record<string, unknown>) ?? {};
  const patch: {
    label?: string;
    description?: string;
    children?: unknown;
  } = {};

  if (label !== undefined) {
    if (typeof label !== "string" || !label.trim()) {
      throw new CategoryValidationError("El campo 'label' debe ser un texto válido");
    }
    patch.label = label;
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new CategoryValidationError("El campo 'description' debe ser un texto");
    }
    patch.description = description;
  }

  if (children !== undefined) {
    patch.children = children;
  }

  if (Object.keys(patch).length === 0) {
    throw new CategoryValidationError("No hay campos para actualizar");
  }

  return updateCategory(id, patch);
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

