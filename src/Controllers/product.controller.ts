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
import { deleteManyFromS3, signS3Url, uploadProductImageToS3 } from "../libs/s3";
import type { Product } from "../entities/Product";
import type { PaginationResponse } from "../entities/PaginationResponse";

function collectProductS3Urls(product: Product): string[] {
  const urls = [...(product.images ?? [])];
  const groups = product.options
    ? Array.isArray(product.options)
      ? product.options
      : [product.options]
    : [];

  for (const group of groups) {
    for (const option of group.options ?? []) {
      if (option.imageUrl) urls.push(option.imageUrl);
    }
  }
  return urls;
}

function parseStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === "") return undefined;
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

type ProductOptionPayload = {
  label: string;
  options: { id: string; label: string; imageUrl?: string }[];
};

function parseProductOptions(value: unknown): ProductOptionPayload[] | undefined {
  if (value === undefined || value === null || value === "") return undefined;

  let parsed: unknown = value;
  if (typeof value === "string") {
    if (value === "null") return undefined;
    try {
      parsed = JSON.parse(value);
    } catch {
      return undefined;
    }
  }

  const normalizeGroup = (group: unknown): ProductOptionPayload | null => {
    if (!group || typeof group !== "object") return null;
    const record = group as Record<string, unknown>;
    if (typeof record.label !== "string" || !record.label.trim()) return null;

    const rawOptions = Array.isArray(record.options) ? record.options : [];
    const options = rawOptions
      .filter((option): option is Record<string, unknown> => !!option && typeof option === "object")
      .map((option) => ({
        id: typeof option.id === "string" && option.id ? option.id : crypto.randomUUID(),
        label: typeof option.label === "string" ? option.label.trim() : "",
        ...(typeof option.imageUrl === "string" ? { imageUrl: option.imageUrl } : {}),
      }))
      .filter((option) => option.label.length > 0);

    if (options.length === 0) return null;
    return { label: record.label.trim(), options };
  };

  if (Array.isArray(parsed)) {
    return parsed.map(normalizeGroup).filter((group): group is ProductOptionPayload => group !== null);
  }

  const single = normalizeGroup(parsed);
  return single ? [single] : undefined;
}

function getUploadedFiles(req: Request): Express.Multer.File[] {
  return Array.isArray(req.files) ? (req.files as Express.Multer.File[]) : [];
}

async function uploadProductImageFiles(files: Express.Multer.File[]): Promise<string[]> {
  const imagesUrls: string[] = [];
  for (const image of files) {
    console.log("[S3] Subiendo imagen de producto:", image.originalname, image.mimetype, image.size);
    const imageUrl = await uploadProductImageToS3(image);
    if (!imageUrl) {
      throw new Error("S3 no devolvió una URL al subir la imagen del producto");
    }
    console.log("[S3] Imagen subida:", imageUrl);
    imagesUrls.push(imageUrl);
  }
  return imagesUrls;
}

async function withSignedImages(product: Product): Promise<Product> {
  if (!product.images?.length) return product;
  const images = await Promise.all(
    product.images.map(async (url) => {
      if (!url.includes("amazonaws.com")) return url;
      return signS3Url(url);
    })
  );
  return { ...product, images };
}

export async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      brandId,
      categoryId,
      name,
      description,
      price,
      stock,
      options,
      isFeatured,
      isInOffer,
      offerPrice,
      professionalPrice,
    } = req.body ?? {};
    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (!categoryId || typeof categoryId !== "string") {
      return res.status(400).json({ message: "El campo 'categoryId' es obligatorio" });
    }
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "El campo 'name' es obligatorio" });
    }
    if (Number.isNaN(priceNumber)) {
      return res.status(400).json({ message: "El campo 'price' debe ser number" });
    }
    if (Number.isNaN(stockNumber)) {
      return res.status(400).json({ message: "El campo 'stock' debe ser number" });
    }

    const images = getUploadedFiles(req);
    const imagesUrls = images.length > 0 ? await uploadProductImageFiles(images) : [];
    const parsedOptions = parseProductOptions(options);

    const created = await createProduct({
      brandId,
      categoryId,
      name,
      description,
      price: priceNumber,
      professionalPrice: professionalPrice !== undefined ? Number(professionalPrice) : undefined,
      stock: stockNumber,
      images: imagesUrls,
      ...(parsedOptions !== undefined ? { options: parsedOptions } : {}),
      isFeatured,
      isInOffer,
      offerPrice,
    });

    return res.status(201).json(await withSignedImages(created));
  } catch (err) {
    next(err as Error);
  }
}

export async function listProductsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await listProducts();
    const signed = await Promise.all(products.map(withSignedImages));
    return res.json(signed);
  } catch (err) {
    next(err as Error);
  }
}

export async function getProductByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await getProductById(req.params.id as string);
    if (!product) return res.status(404).json({ message: "Product no encontrado" });
    return res.json(await withSignedImages(product));
  } catch (err) {
    next(err as Error);
  }
}

export async function getProductByBrandIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await getProductByBrandId(req.params.brandId as string);
    const signed = await Promise.all(products.map(withSignedImages));
    return res.json(signed);
  } catch (err) {
    next(err as Error);
  }
}

export async function getProductByCategoryIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const response = await getProductByCategoryId(
      req.params.categoryId as string,
      page,
      pageSize
    );
    const signedData = await Promise.all(response.data.map(withSignedImages));
    const payload: PaginationResponse<Product> = { ...response, data: signedData };
    return res.json(payload);
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
    const { existingImages, images: imagesField, options, ...rest } = body;
    const patch: Record<string, unknown> = { ...rest };
    delete patch.images;

    if (patch.price !== undefined) patch.price = Number(patch.price);
    if (patch.professionalPrice !== undefined) {
      patch.professionalPrice = Number(patch.professionalPrice);
    }
    if (patch.stock !== undefined) patch.stock = Number(patch.stock);

    if (options !== undefined) {
      const parsedOptions = parseProductOptions(options);
      patch.options = parsedOptions ?? [];
    }

    const uploadedFiles = getUploadedFiles(req);
    const parsedExistingImages = parseStringArray(existingImages);
    const parsedImagesField = parseStringArray(imagesField);

    if (uploadedFiles.length > 0) {
      // Al subir archivos nuevos, conservar las que indique el front o las actuales
      const keptImages =
        parsedExistingImages !== undefined ? parsedExistingImages : existing.images ?? [];
      const newImagesUrls = await uploadProductImageFiles(uploadedFiles);
      patch.images = [...keptImages, ...newImagesUrls];
      console.log("[S3] Producto actualizado con imágenes:", patch.images);
    } else if (parsedExistingImages !== undefined) {
      patch.images = parsedExistingImages;
    } else if (parsedImagesField !== undefined) {
      patch.images = parsedImagesField;
    }

    const updated = await updateProduct(id, patch);
    if (!updated) return res.status(404).json({ message: "Product no encontrado" });
    return res.json(await withSignedImages(updated));
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await getProductById(req.params.id as string);
    if (!existing) return res.status(404).json({ message: "Product no encontrado" });

    await deleteProduct(req.params.id as string);
    await deleteManyFromS3(collectProductS3Urls(existing));

    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}
