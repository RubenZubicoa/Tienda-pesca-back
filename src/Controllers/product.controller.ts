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

function parseStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return undefined;
    }
  }
  return undefined;
}

async function uploadProductImageFiles(files: Express.Multer.File[]): Promise<string[] | null> {
  const imagesUrls: string[] = [];
  for await (const image of files) {
    const imageUrl = await uploadToCloudinary(image);
    if (!imageUrl) return null;
    imagesUrls.push(imageUrl);
  }
  return imagesUrls;
}

export async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const { brandId, categoryId, name, description, price, stock, options } = req.body ?? {};
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

    const images = (req.files as Express.Multer.File[]) ?? [];
    const imagesUrls = await uploadProductImageFiles(images);
    if (!imagesUrls) {
      return res.status(400).json({ message: "Error al subir la imagen del producto" });
    }

    const created = await createProduct({
      brandId,
      categoryId,
      name,
      description,
      price,
      stock,
      images: imagesUrls,
      options,
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
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const response = await getProductByCategoryId(req.params.categoryId as string, page, pageSize);
    return res.json(response);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const existing = await getProductById(id);
    if (!existing) return res.status(404).json({ message: "Product no encontrado" });

    const body = req.body ?? {};
    const { existingImages, images: imagesField, ...rest } = body;
    const patch: Record<string, unknown> = { ...rest };

    if (patch.price !== undefined) patch.price = Number(patch.price);
    if (patch.stock !== undefined) patch.stock = Number(patch.stock);

    const uploadedFiles = (req.files as Express.Multer.File[]) ?? [];
    const parsedExistingImages = parseStringArray(existingImages);
    const parsedImagesField = parseStringArray(imagesField);

    if (uploadedFiles.length > 0 || parsedExistingImages !== undefined) {
      const keptImages =
        parsedExistingImages !== undefined ? parsedExistingImages : existing.images;
      const validUrls = new Set(existing.images);

      if (keptImages.some((url) => !validUrls.has(url))) {
        return res.status(400).json({ message: "Alguna imagen existente no pertenece al producto" });
      }

      const newImagesUrls = await uploadProductImageFiles(uploadedFiles);
      if (!newImagesUrls) {
        return res.status(400).json({ message: "Error al subir la imagen del producto" });
      }

      patch.images = [...keptImages, ...newImagesUrls];
    } else if (parsedImagesField !== undefined) {
      patch.images = parsedImagesField;
    }

    const updated = await updateProduct(id, patch);
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

