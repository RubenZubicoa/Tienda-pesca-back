import type { NextFunction, Request, Response } from "express";
import {
  createNewsLetterSubscription,
  deleteNewsLetterSubscription,
  getNewsLetterSubscriptionByEmail,
  getNewsLetterSubscriptionById,
  listNewsLetterSubscriptions,
  updateNewsLetterSubscription,
} from "../Models/newsLetterSubscription.model";

export async function createNewsLetterSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body ?? {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "El campo 'email' es obligatorio" });
    }

    const existing = await getNewsLetterSubscriptionByEmail(email.trim());
    if (existing) {
      return res.status(400).json({ message: "Este email ya está suscrito al newsletter" });
    }

    const created = await createNewsLetterSubscription({ email: email.trim() });
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listNewsLetterSubscriptionsController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const subscriptions = await listNewsLetterSubscriptions();
    return res.json(subscriptions);
  } catch (err) {
    next(err as Error);
  }
}

export async function getNewsLetterSubscriptionByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const subscription = await getNewsLetterSubscriptionById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }
    return res.json(subscription);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateNewsLetterSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const { email } = req.body ?? {};
    const patch: { email?: string } = {};

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "El campo 'email' no es válido" });
      }
      const existing = await getNewsLetterSubscriptionByEmail(email.trim());
      if (existing && String(existing._id) !== id) {
        return res.status(400).json({ message: "Este email ya está suscrito al newsletter" });
      }
      patch.email = email.trim();
    }

    const updated = await updateNewsLetterSubscription(id, patch);
    if (!updated) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }
    return res.json(updated);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteNewsLetterSubscriptionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const existing = await getNewsLetterSubscriptionById(id);
    if (!existing) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }
    await deleteNewsLetterSubscription(id);
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}
