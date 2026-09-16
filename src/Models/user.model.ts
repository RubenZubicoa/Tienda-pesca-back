import { ObjectId } from "mongodb";
import { database } from "../db/database";
import { AddUser, UpdateUser, User } from "../entities/User";
import { comparePassword, hashPassword } from "../libs/bcrypt";

export async function getUserByEmail(email: string) {
  const user = await database.collection<User>("users").findOne({ email, isDeleted: { $ne: true } });
  return user;
}

export async function createUser(user: AddUser) {
  const now = Date.now();
  const hashedPassword = await hashPassword(user.password);
  const doc: User = { ...user, password: hashedPassword, createdAt: now, updatedAt: now, isDeleted: false };
  const result = await database.collection<User>("users").insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listUsers() {
  return await database.collection<User>("users").find({ isDeleted: { $ne: true } }).toArray();
}

export async function getUserById(id: string) {
  return await database.collection<User>("users").findOne({ _id: new ObjectId(id), isDeleted: { $ne: true } });
}

export async function updateUser(id: string, user: UpdateUser) {
  return await database.collection<User>("users").updateOne({ _id: new ObjectId(id), isDeleted: { $ne: true } }, { $set: user });
}

export async function deleteUser(id: string) {  
  return await database.collection<User>("users").updateOne({ _id: new ObjectId(id), isDeleted: { $ne: true } }, { $set: { isDeleted: true } });
}

export async function changePassword(id: string, password: string) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  const newHashedPassword = await hashPassword(password);
  return await database.collection<User>("users").updateOne({ _id: new ObjectId(id), isDeleted: { $ne: true } }, { $set: { password: newHashedPassword, updatedAt: Date.now() } });
}