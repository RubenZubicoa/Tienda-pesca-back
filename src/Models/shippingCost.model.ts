import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { ShippingCost } from "../entities/ShippingCost";

const collection = database.collection<ShippingCost>("shippingCosts");

export async function createShippingCost(
  input: Omit<ShippingCost, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) {
  const now = Date.now();
  const doc: ShippingCost = { ...input, createdAt: now, updatedAt: now, isDeleted: false };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listShippingCosts() {
  return await collection
    .find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getShippingCostById(id: string) {
  const _id = new ObjectId(id);
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function updateShippingCost(
  id: string,
  patch: Partial<Omit<ShippingCost, "_id" | "createdAt">>
) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne(
    { _id, isDeleted: { $ne: true } },
    { $set: { ...patch, updatedAt } }
  );
  return await collection.findOne({ _id, isDeleted: { $ne: true } });
}

export async function deleteShippingCost(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}
