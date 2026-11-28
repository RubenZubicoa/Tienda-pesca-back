import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { NewsLetter } from "../entities/NewsLetter";

const collection = database.collection<NewsLetter>("newsletters");

export async function createNewsLetter(
  input: Omit<NewsLetter, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) {
  const now = Date.now();
  const doc: NewsLetter = { ...input, createdAt: now, updatedAt: now, isDeleted: false };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listNewsLetters() {
  return await collection
    .find({ isDeleted: { $ne: true } })
    .sort({ publishedAt: -1, createdAt: -1 })
    .toArray();
}

export async function getNewsLetterById(id: string) {
  const _id = new ObjectId(id);
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function updateNewsLetter(
  id: string,
  patch: Partial<Omit<NewsLetter, "_id" | "createdAt">>
) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne(
    { _id, isDeleted: { $ne: true } },
    { $set: { ...patch, updatedAt } }
  );
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function deleteNewsLetter(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}
