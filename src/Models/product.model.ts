import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { Product } from "../entities/Product";

const collection = database.collection<Product>("products");

export async function createProduct(
  input: Omit<Product, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) {
  const now = Date.now();
  const doc: Product = { ...input, createdAt: now, updatedAt: now, isDeleted: false };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listProducts() {
  return await collection
    .find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getProductById(id: string) {
  const _id = new ObjectId(id);
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function getProductByBrandId(brandId: string) {
  return await collection.find({ brandId, isDeleted: { $ne: true } }).toArray();
}

export async function updateProduct(id: string, patch: Partial<Omit<Product, "_id" | "createdAt">>) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne(
    { _id, isDeleted: { $ne: true } },
    { $set: { ...patch, updatedAt } }
  );
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function deleteProduct(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}

