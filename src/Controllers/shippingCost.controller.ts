import type { NextFunction, Request, Response } from "express";
import {
  createShippingCost,
  deleteShippingCost,
  getShippingCostById,
  listShippingCosts,
  updateShippingCost,
} from "../Models/shippingCost.model";
import type { ShippingCostList } from "../entities/ShippingCost";

function isValidCostList(costList: unknown): costList is ShippingCostList[] {
  return (
    Array.isArray(costList) &&
    costList.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as ShippingCostList).company === "string" &&
        typeof (item as ShippingCostList).cost === "number"
    )
  );
}

export async function createShippingCostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { zone, costList } = req.body ?? {};
    if (!zone || typeof zone !== "string") {
      return res.status(400).json({ message: "El campo 'zone' es obligatorio" });
    }
    if (!isValidCostList(costList)) {
      return res.status(400).json({
        message: "El campo 'costList' debe ser un array de { company: string, cost: number }",
      });
    }

    const created = await createShippingCost({ zone, costList });
    return res.status(201).json(created);
  } catch (err) {
    next(err as Error);
  }
}

export async function listShippingCostsController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const shippingCosts = await listShippingCosts();
    return res.json(shippingCosts);
  } catch (err) {
    next(err as Error);
  }
}

export async function getShippingCostByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const shippingCost = await getShippingCostById(id);
    if (!shippingCost) {
      return res.status(404).json({ message: "Coste de envío no encontrado" });
    }
    return res.json(shippingCost);
  } catch (err) {
    next(err as Error);
  }
}

export async function updateShippingCostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const { zone, costList } = req.body ?? {};
    const patch: { zone?: string; costList?: ShippingCostList[] } = {};

    if (zone !== undefined) {
      if (typeof zone !== "string" || !zone.trim()) {
        return res.status(400).json({ message: "El campo 'zone' no es válido" });
      }
      patch.zone = zone.trim();
    }

    if (costList !== undefined) {
      if (!isValidCostList(costList)) {
        return res.status(400).json({
          message: "El campo 'costList' debe ser un array de { company: string, cost: number }",
        });
      }
      patch.costList = costList;
    }

    const updated = await updateShippingCost(id, patch);
    if (!updated) {
      return res.status(404).json({ message: "Coste de envío no encontrado" });
    }
    return res.json(updated);
  } catch (err) {
    next(err as Error);
  }
}

export async function deleteShippingCostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const existing = await getShippingCostById(id);
    if (!existing) {
      return res.status(404).json({ message: "Coste de envío no encontrado" });
    }
    await deleteShippingCost(id);
    return res.status(204).send();
  } catch (err) {
    next(err as Error);
  }
}
