import { NextFunction, Request, Response } from "express";
import { changePassword, createUser, deleteUser, getUserByEmail, getUserById, listUsers, updateUser } from "../Models/user.model";

export async function createUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const userData = req.body;
    const user = await getUserByEmail(userData.email);
    if (user) return res.status(400).json({ message: "El email ya está en uso, intente con otro o inicie sesión" });
    const created = await createUser(userData);
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}   

export async function listUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await listUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err as Error);
  }
}

export async function getUserByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "El campo 'id' es obligatorio" });
    }
    const user = await getUserById(id as string);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "El campo 'id' es obligatorio" });
    }
    const user = req.body;
    const updated = await updateUser(id as string, user);
    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(updated);
  } catch (err) {   
    next(err as Error);
  }
}

export async function deleteUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "El campo 'id' es obligatorio" });
    }
    const deleted = await deleteUser(id as string);
    if (!deleted) { 
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}

export async function changePasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;  
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "El campo 'id' es obligatorio" });
    }
    const { password } = req.body;
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "El campo 'password' es obligatorio" });
    }
    const changed = await changePassword(id as string, password);
    if (!changed) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(changed);
  } catch (err) {
    next(err as Error);
  }
}