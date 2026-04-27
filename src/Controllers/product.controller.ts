import type { NextFunction, Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductByBrandId,
  getProductById,
  listProducts,
  updateProduct,
} from "../Models/product.model";

export async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const { brandId, categoryId, name, description, price, stock, images } = req.body ?? {};

    if (!brandId || typeof brandId !== "string") {
      return res.status(400).json({ message: "El campo 'brandId' es obligatorio" });
    }
    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({ message: "El campo 'categoryId' es obligatorio" });
    }
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }
    if (typeof price !== "number") {
      return res.status(400).json({ message: "El campo 'price' debe ser number" });
    }
    if (typeof stock !== "number") {
      return res.status(400).json({ message: "El campo 'stock' debe ser number" });
    }
    if (!Array.isArray(images) || images.some((x) => typeof x !== "string")) {
      return res.status(400).json({ message: "El campo 'images' debe ser string[]" });
    }

    const created = await createProduct({
      brandId,
      categoryId,
      name,
      description,
      price,
      stock,
      images,
    });
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listProductsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await listProducts();
    return res.json(products);
  } catch (err) {
    next(err as Error);
  }
}

export async function getProductByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await getProductById(req.params.id as string);
    if (!product) return res.status(404).json({ message: "Product no encontrado" });
    return res.json(product);
  } catch (err) {
    next(err as Error);
  }
}

export async function getProductByBrandIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await getProductByBrandId(req.params.brandId as string);
    return res.json(products);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const patch = req.body ?? {};
    const updated = await updateProduct(req.params.id as string, patch);
    if (!updated) return res.status(404).json({ message: "Product no encontrado" });
    return res.json(updated);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await getProductById(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Product no encontrado" });
    await deleteProduct(req.params.id as string);
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}

