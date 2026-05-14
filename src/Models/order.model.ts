import { ObjectId } from "mongodb";
import { database } from "../db/database";
import { AddOrder, Order, UpdateOrder } from "../entities/Order";

export async function createOrder(order: AddOrder) {
  const now = Date.now();
  const doc: Order = { ...order, createdAt: now, updatedAt: now, isDeleted: false, status: "pending" };
  const result = await database.collection<Order>("orders").insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listOrders() {
  return await database.collection<Order>("orders").find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
}

export async function getOrderById(id: string) {
  return await database.collection<Order>("orders").findOne({ _id: new ObjectId(id), isDeleted: { $ne: true } });
}

export async function updateOrder(id: string, order: UpdateOrder) {
  return await database.collection<Order>("orders").updateOne({ _id: new ObjectId(id), isDeleted: { $ne: true } }, { $set: order });
}

export async function deleteOrder(id: string) {
  return await database.collection<Order>("orders").updateOne({ _id: new ObjectId(id), isDeleted: { $ne: true } }, { $set: { isDeleted: true } });
}