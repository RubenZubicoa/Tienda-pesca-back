import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { NewsLetterSubscription } from "../entities/NewsLetterSubscription";

const collection = database.collection<NewsLetterSubscription>("newsletterSubscriptions");

export async function createNewsLetterSubscription(
  input: Omit<NewsLetterSubscription, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) {
  const now = Date.now();
  const doc: NewsLetterSubscription = {
    ...input,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listNewsLetterSubscriptions() {
  return await collection
    .find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getNewsLetterSubscriptionById(id: string) {
  const _id = new ObjectId(id);
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function getNewsLetterSubscriptionByEmail(email: string) {
  return await collection.findOne(
    { email, isDeleted: { $ne: true } },
    { collation: { locale: "en", strength: 2 } }
  );
}

export async function updateNewsLetterSubscription(
  id: string,
  patch: Partial<Omit<NewsLetterSubscription, "_id" | "createdAt">>
) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne(
    { _id, isDeleted: { $ne: true } },
    { $set: { ...patch, updatedAt } }
  );
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function deleteNewsLetterSubscription(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}
