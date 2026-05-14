import type { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../Models/user.model";
import { generateToken } from "../libs/jwt";
import { comparePassword } from "../utils/password-utils";

export async function loginController(req: Request<null, null, { email: string; password: string }>, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "El campo 'email' es obligatorio" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "El campo 'password' es obligatorio" });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = generateToken(user);
    return res.status(200).json({ token, user});
  } catch (err) {
    next(err as Error);
  }
}