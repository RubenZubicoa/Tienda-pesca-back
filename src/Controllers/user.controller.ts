import { NextFunction, Request, Response } from "express";
import { AddUser, UpdateUser } from "../entities/User";
import {
  changePassword,
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  listUsers,
  updateUser,
} from "../Models/user.model";

export async function createUserController(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      dni,
      name,
      lastName,
      phone,
      address,
      email,
      password,
      role,
      isProfessional,
      country,
    } = req.body ?? {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "El campo 'email' es obligatorio" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "El campo 'password' es obligatorio" });
    }
    if (country !== undefined && country !== null && (typeof country !== "string" || !country.trim())) {
      return res.status(400).json({ message: "El campo 'country' no es válido" });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        message: "El email ya está en uso, intente con otro o inicie sesión",
      });
    }

    const userData: AddUser = {
      dni,
      name,
      lastName,
      phone,
      address,
      email,
      password,
      role,
      isProfessional: Boolean(isProfessional),
      ...(typeof country === "string" && country.trim() ? { country: country.trim() } : {}),
    };

    const created = await createUser(userData);
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listUsersController(_req: Request, res: Response, next: NextFunction) {
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
    const user = await getUserById(id);
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

    const existing = await getUserById(id);
    if (!existing) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const {
      dni,
      name,
      lastName,
      phone,
      address,
      email,
      role,
      isProfessional,
      country,
    } = req.body ?? {};

    if (country !== undefined && (typeof country !== "string" || !country.trim())) {
      return res.status(400).json({ message: "El campo 'country' no es válido" });
    }

    const patch: UpdateUser = {
      dni: dni ?? existing.dni,
      name: name ?? existing.name,
      lastName: lastName ?? existing.lastName,
      phone: phone ?? existing.phone,
      address: address ?? existing.address,
      email: email ?? existing.email,
      role: role ?? existing.role,
      isProfessional:
        isProfessional !== undefined ? Boolean(isProfessional) : existing.isProfessional,
      country: country !== undefined ? country.trim() : existing.country,
    };

    await updateUser(id, patch);
    const updated = await getUserById(id);
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
    const existing = await getUserById(id);
    if (!existing) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await deleteUser(id);
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
    const changed = await changePassword(id, password);
    if (!changed) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(changed);
  } catch (err) {
    next(err as Error);
  }
}
