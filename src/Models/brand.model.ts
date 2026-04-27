import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { Brand } from "../entities/Brand";

const collection = database.collection<Brand>("brands");

export async function createBrand(input: Omit<Brand, "_id" | "createdAt" | "updatedAt" | "isDeleted">) {
  const now = Date.now();
  const doc: Brand = { ...input, createdAt: now, updatedAt: now, isDeleted: false };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listBrands() {
  return await collection
    .find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getBrandById(id: string) {
  const _id = new ObjectId(id);
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function updateBrand(id: string, patch: Partial<Omit<Brand, "_id" | "createdAt">>) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne(
    { _id, isDeleted: { $ne: true } },
    { $set: { ...patch, updatedAt } }
  );
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function deleteBrand(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}

