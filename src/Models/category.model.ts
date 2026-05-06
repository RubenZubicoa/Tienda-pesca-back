import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { Category } from "../entities/Category";

const collection = database.collection<Category>("categories");

export async function createCategory(
  input: Omit<Category, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) {
  const now = Date.now();
  const doc: Category = { ...input, createdAt: now, updatedAt: now, isDeleted: false };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listCategories() {
  return await collection.find().toArray();
}

export async function getCategoryById(id: string) {
  const _id = new ObjectId(id);
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function updateCategory(
  id: string,
  patch: Partial<Omit<Category, "_id" | "createdAt">>
) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne(
    { _id, isDeleted: { $ne: true } },
    { $set: { ...patch, updatedAt } }
  );
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function deleteCategory(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}

