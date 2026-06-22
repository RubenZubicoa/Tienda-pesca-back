import type { NextFunction, Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductByBrandId,
  getProductByCategoryId,
  getProductById,
  listProducts,
  updateProduct,
} from "../Models/product.model";
import { uploadToCloudinary } from "../libs/cloudinary";

export async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const { brandId, categoryId, name, description, price, stock } = req.body ?? {};
    const priceNumber = Number(price);
    const stockNumber = Number(stock);
    
    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({ message: "El campo 'categoryId' es obligatorio" });
    }
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }
    if (typeof priceNumber !== "number") {
      return res.status(400).json({ message: "El campo 'price' debe ser number" });
    }
    if (typeof stockNumber !== "number") {
      return res.status(400).json({ message: "El campo 'stock' debe ser number" });
    }

    const imagesUrls: string[] = [];
    const images = req.files as Express.Multer.File[];
    for await (const image of images) {
      const imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        return res.status(400).json({ message: "Error al subir la imagen del producto" });
      }
      imagesUrls.push(imageUrl);
    }

    const created = await createProduct({
      brandId,
      categoryId,
      name,
      description,
      price,
      stock,
      images: imagesUrls,
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

export async function getProductByCategoryIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await getProductByCategoryId(req.params.categoryId as string);
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

